// Copyright 2011 Splunk, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License"): you may
// not use this file except in compliance with the License. You may obtain
// a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.

var SearchApp = Backbone.Router.extend({
  initialize: function(svc) {
    window.App = this;
    
    this.events = _.extend({}, Backbone.Events);
    this.searchView = new SearchView({service: svc});
    this.jobsView = new JobManagerView({service: svc});
    
    _.bindAll(this, "search", "jobs");
    
    this.searchView.render();
    this.jobsView.render();
  },
  
  routes: {
    "" : "search",
    "search" : "search",
    "jobs": "jobs"
  },
  
  search : function() {
    this.setNavigationHighlight("search");
    
    $("#content").detach();
    $("#content-container").append(this.searchView.el);
  },
  
  jobs : function() {
    this.setNavigationHighlight("jobs");
    
    $("#content").detach();
    $("#content-container").append(this.jobsView.el);
  },
  
  setNavigationHighlight: function(view) {
    $("#navbar li").each(function(index, elem) {
      $(elem).removeClass("active");
      
      if ($(elem).children("a").attr("href").substring(1) === view) {
        $(elem).addClass("active");
      }
    });
  }
});

$(document).ready(function() {  
  var http = new XdmHttp(true, "http://localhost:8000");
  var svc = new Splunk.Client.Service(http, { 
      scheme: "http",
      host: "localhost",
      port: "8000",
      username: "itay",
      password: "changeme",
  });      
    
  var loginP = svc.login();
  var doneP = loginP.whenResolved(function() {
    var app = new SearchApp(svc);
    Backbone.history.start();
  });
});