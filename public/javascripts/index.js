
  $(function() {
    var Content, Slide, header, slide;
    header = $("#header");
    header.css({
      "padding": "10px",
      "text-align": "center"
    });
    Content = (function() {

      function Content(param) {
        var self;
        this.param = param;
        this.type = this.param["type"];
        this.comment = this.param["comment"];
        this.content = this.param["content"];
        self = this;
        this.__defineGetter__("is_video", function() {
          return self.type === "video";
        });
        this.html = this[this.type]();
        this.is_end = false;
      }

      Content.prototype.wrap = function(obj) {
        return $("<div />").css({
          "padding": "10px 0px",
          "text-align": "center"
        }).append(obj);
      };

      Content.prototype.text = function() {
        return this.content;
      };

      Content.prototype.page = function() {
        return this.wrap($("<iframe />").attr({
          src: this.content,
          width: "80%",
          height: $(window).height() - $("#header").height()
        }));
      };

      Content.prototype.image = function() {
        return this.wrap($("<img />").attr({
          src: this.content
        }));
      };

      Content.prototype.video = function() {
        return this.wrap($("<div />").attr({
          id: "video"
        }));
      };

      Content.prototype.show = function() {
        var self, video;
        $("#comment").html(this.comment);
        if (this.is_video) {
          self = this;
          video = this.html.find("#video").ganpuku(this.content);
          return video.on_load(function() {
            video.on("ready", function(player) {
              return player.playVideo();
            });
            return video.on("end", function() {
              return self.is_end = true;
            });
          });
        } else {
          return this.is_end = true;
        }
      };

      return Content;

    })();
    Slide = (function() {

      function Slide(list) {
        this.list = list;
        this.index = -1;
        this.slide = $("#slide").fusuma($("body").width());
      }

      Slide.prototype.start = function() {
        var count, on_sec, self, timer;
        self = this;
        count = 0;
        on_sec = function() {
          count++;
          if (count > 1000000) count = 0;
          if (count % 15 < 1 && self.current.is_end) return self.next();
        };
        timer = setInterval(on_sec, 1000);
        return self.next();
      };

      Slide.prototype.next = function() {
        var self;
        self = this;
        this.index++;
        if (this.index >= this.list.length) this.index = 0;
        this.current = new Content(this.list[this.index]);
        this.slide.add(this.current.html).to("end");
        return this.slide.go("next", function() {
          self.slide.remove("prev");
          return self.current.show();
        });
      };

      return Slide;

    })();
    slide = new Slide(data);
    return slide.start();
  });
