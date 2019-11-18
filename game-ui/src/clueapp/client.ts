export function request<Request, Response>(
  method: "GET" | "POST",
  url: string,
  content?: Request,
  callback?: (response: Response) => void,
  errorCallback?: (err: any) => void
) {
  const request = new XMLHttpRequest();
  request.open(method, url, true);
  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      const data = JSON.parse(this.response) as Response;
      callback && callback(data);
    } else {
      console.log(500);
      if (errorCallback) {
        // const data = JSON.parse(this.response) as Response;
        errorCallback(this.responseText);
      }
    }
  };

  request.onerror = function(err) {
    console.log("in on err");
    errorCallback && errorCallback(err);
  };
  if (method === "POST") {
    request.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
  }

  request.send(JSON.stringify(content));
}

function req<Request, Response>(
  method: "GET" | "POST",
  url: string,
  content?: Request
): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    request(method, url, content, resolve, reject);
  });
}
