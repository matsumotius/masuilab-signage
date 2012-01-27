$ ->
  header = $("#header")
  header.css {
    "padding"    : "10px"
    "text-align" : "center"
  }
  # console.log Date.now()

  class Content
    constructor : (@param) ->
      @type    = @param["type"]
      @comment = @param["comment"]
      @content = @param["content"]

      self = this
      this.__defineGetter__("is_video", ->
        return self.type == "video"
      )
      @html   = this[@type]()
      @is_end = false

    wrap  : (obj) ->
      return $("<div />").css({
        "padding"    : "10px 0px",
        "text-align" : "center"
      }).append(obj)

    text  : ->
      return @content

    page  : ->
      return this.wrap $("<iframe />").attr({
        src    : @content,
        width  : "80%",
        height : $(window).height() - $("#header").height()
      })

    image : ->
      return this.wrap $("<img />").attr({ src : @content })

    video : ->
      return this.wrap $("<div />").attr({ id : "video" })

    show  : ->
      $("#comment").html @comment
      if this.is_video
        self  = this
        video = @html.find("#video").ganpuku(@content)
        video.on_load(() ->
          video.on("ready", (player) ->
            # fixme: it occurs error when call video.player.play()
            player.playVideo()
          )
          video.on("end", () ->
            self.is_end = true
          )
        )
      else
        @is_end = true

  class Slide
    constructor : (@list) ->
      @index   = -1
      @slide   = $("#slide").fusuma($("body").width())

    start : ->
      self   = this
      count  = 0
      on_sec = ->
        count++
        count = 0 if count > 1000000
        self.next() if count % 15 < 1 and self.current.is_end
      timer  = setInterval on_sec, 1000
      self.next()

    next  : ->
      self = this
      @index++
      @index   = 0 if @index >= @list.length
      @current = new Content @list[@index]
      @slide.add(@current.html).to("end")
      @slide.go("next", () ->
        self.slide.remove "prev"
        self.current.show()
      )

  slide = new Slide data
  slide.start()
