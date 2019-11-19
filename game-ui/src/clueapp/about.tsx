import React, { useState } from "react";

export const About = () => (
  <div className="aboutBlock">
    <a href="https://github.com/mitchdraft/mysteryservice">
      Mystery Service Game
    </a>{" "}
    created to demonstrate the{" "}
    <a href="https://www.envoyproxy.io/docs/envoy/v1.12.0/configuration/http/http_filters/tap_filter.html">
      Tap Filter
    </a>{" "}
    for <a href="https://sched.co/Uxwa">EnvoyCon 2019</a>.
  </div>
);
