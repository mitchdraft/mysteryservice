package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/solo-io/go-utils/contextutils"
	"go.uber.org/zap"

	server "github.com/mitchdraft/mysteryservice/service/mystery/pkg/game"
)

func main() {
	ctx := context.Background()
	err := run(ctx)
	if err != nil {
		log.Fatalf("unable to run %v", err)
	}
}

const (
	defaultPort = 8080
)

func optionsFromFlags() *Options {
	opts := &Options{}
	flag.BoolVar(&opts.AddrOpts.Local, "local", false, "serve locally")
	flag.UintVar(&opts.AddrOpts.Port, "port", defaultPort, "port")
	flag.Parse()
	return opts
}
func run(ctx context.Context) error {
	opts := optionsFromFlags()
	return runWithOptions(ctx, opts)
}
func runWithOptions(ctx context.Context, opts *Options) error {
	svr := server.NewHttpServer(ctx)
	addr := addrFromOpts(opts.AddrOpts)
	contextutils.LoggerFrom(ctx).Infow("serving at", zap.Any("addr", addr))
	return http.ListenAndServe(addr, svr)
}

type Options struct {
	AddrOpts AddrOpts
}

type AddrOpts struct {
	Local bool
	Port  uint
}

func addrFromOpts(ao AddrOpts) string {
	host := "0.0.0.0"
	if ao.Local {
		host = "127.0.0.1"
	}
	return fmt.Sprintf("%v:%v", host, ao.Port)
}
