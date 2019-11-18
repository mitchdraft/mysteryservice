package server

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/pkg/errors"

	"github.com/solo-io/go-utils/contextutils"
	"go.uber.org/zap"
)

type state struct {
	ctx       context.Context
	lock      sync.Mutex
	logger    *zap.SugaredLogger
	api       map[string]http.HandlerFunc
	mysteries map[Mystery]bool
}

func NewHttpServer(ctx context.Context) *state {
	logger := contextutils.LoggerFrom(ctx)
	ao := &ApiOptions{ctx: ctx,
		logger: logger,
	}
	st := &state{
		ctx:       ctx,
		logger:    logger,
		lock:      sync.Mutex{},
		mysteries: make(map[Mystery]bool),
	}
	m := buildApiMap(ao, BasicApi)
	st.api = m
	ao.state = st
	st.IngestMysteries(InitialMysteries)
	return st
}

func (s *state) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	//var v http.HandlerFunc
	//var ok bool
	handler, ok := s.api[r.RequestURI]
	if ok {
		s.logger.Infow("got uri", zap.Any("uri", r.RequestURI))
		handler(w, r)
	} else {
		s.logger.Warnw("unknown uri", zap.Any("uri", r.RequestURI))
	}
}

type Api struct {
	Uri         string
	Description string
	Payload     Payload
	Handler     HandleApiFunc
}
type Payload struct {
	// represents a guess at the crime
	Guess *GuessPayload `json:"guess,omitempty"`
	// indicates the "winning" guess
	Crime *GuessPayload `json:"crime,omitempty"`
}
type GuessPayload struct {
	Guest  string
	Room   string
	Object string
}
type Mystery struct {
	Guest  string
	Room   string
	Object string
}

var InitialMysteries = []Mystery{{
	Guest:  "a",
	Room:   "b",
	Object: "c",
}, {
	Guest:  "1",
	Room:   "2",
	Object: "3",
}}

func (s *state) IngestMysteries(mysteries []Mystery) {
	s.lock.Lock()
	defer s.lock.Unlock()
	for _, m := range mysteries {
		s.mysteries[m] = true
	}
}

// data that is shared among all api endpoints
type ApiOptions struct {
	ctx    context.Context
	logger *zap.SugaredLogger
	state  *state
}

func buildApiMap(ao *ApiOptions, endpoints []Api) map[string]http.HandlerFunc {
	m := make(map[string]http.HandlerFunc, len(endpoints))
	for _, ep := range endpoints {
		m[ep.Uri] = ep.Handler(ao)
	}
	return m
}

var BasicApi = []Api{{
	Description: "returns the request it received",
	Uri:         "/echo",
	Payload:     Payload{},
	Handler: func(ao *ApiOptions) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			payload, err := getPayload(r)
			if err != nil {
				ao.logger.Warnw("unable to parse payload", zap.Error(err))
				return
			}
			je := json.NewEncoder(w)
			if err := je.Encode(payload); err != nil {
				ao.logger.Warnw("unable to encode json",
					zap.Any("uri", "echo"),
					zap.Error(err))
				return
			}
		}
	},
}, {
	Description: "returns the full state of the active game",
	Uri:         "/gamestate",
	Payload:     Payload{},
	Handler: func(ao *ApiOptions) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
		}
	},
}, {
	Description: "returns the full state of the active game",
	Uri:         "/guess",
	Payload:     Payload{Guess: &GuessPayload{}},
	Handler: func(ao *ApiOptions) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			guess, err := getGuess(r)
			if err != nil {
				ao.logger.Errorw("unable to get guess", zap.Error(err))
				return
			}
			ao.state.judgeGuess(w, guess)
			return
		}
	},
}, {
	Description: "sets the game state according to the GuessPayload",
	Uri:         "/definegame",
	Payload:     Payload{Crime: &GuessPayload{}},
	Handler: func(ao *ApiOptions) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
		}
	},
}}

type HandleApiFunc func(*ApiOptions) http.HandlerFunc

func getGuess(r *http.Request) (*GuessPayload, error) {
	pl, err := getPayload(r)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to parse payload from request")
	}
	if pl.Guess == nil {
		return nil, errors.New("no guess present in request")
	}
	return pl.Guess, nil
}

func getPayload(r *http.Request) (*Payload, error) {
	jd := json.NewDecoder(r.Body)
	payload := &Payload{}
	err := jd.Decode(payload)
	return payload, err
}

type Judgement struct {
	Msg string
}

var (
	nilGuessJudgement = &Judgement{
		Msg: "nil guess received (should not happen in this demo)",
	}
)

func (s *state) judgeGuess(w http.ResponseWriter, guess *GuessPayload) {
	je := json.NewEncoder(w)
	if guess == nil {
		if err := je.Encode(nilGuessJudgement); err != nil {
			s.logger.Errorw("unable to encode judgement", zap.Error(err))
		}
		s.logger.Errorw("nil guess received")
		return
	}
	s.lock.Lock()
	solved := s.mysteries[Mystery(*guess)]
	s.lock.Unlock()
	if solved {
		// this is the "crime"
		w.WriteHeader(http.StatusInternalServerError)
		if _, err := fmt.Fprintf(w, "aaaaaaahhhhhhh!!!!"); err != nil {
			s.logger.Warnw("unable to write solution message", zap.Error(err))
		}
		return
	}
	keepGuessing := &Judgement{Msg: fmt.Sprintf("keep guessing, it's not %v", guess.Guest)}
	if err := je.Encode(keepGuessing); err != nil {
		s.logger.Errorw("unable to encode judgement", zap.Error(err))
	}
}
