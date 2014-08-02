A = require './sun-altitude.coffee'

$ = document.querySelector.bind document

init_canvas = ->
    canvas = $ '#alt-graph'
    canvas.width = window.innerWidth
    canvas.height = 0.7 * window.innerHeight

init_canvas()

draw = (timespan, lat, long) ->
    ctx = $('#alt-graph').getContext '2d'

    # clear
    ctx.canvas.width = ctx.canvas.width

    yOrigo = Math.floor ctx.canvas.height / 2
    d = new Date()
    d.setHours 0
    d.setMinutes 0
    d.setSeconds 0

    sun_radius = 10

    nPts = 120
    tAtom = timespan / nPts
    xAtom = if timespan > 0 then ctx.canvas.width / timespan else 0
    yAtom = (sun_radius + ctx.canvas.height / 2) / 90

    # horizon
    ctx.beginPath()
    ctx.strokeStyle = 'silver'
    ctx.lineWidth = 1
    ctx.moveTo 0, yOrigo
    ctx.lineTo window.innerWidth, yOrigo
    ctx.stroke()

    # draw current sun
    ctx.beginPath()
    ctx.fillStyle = 'orange'
    ctx.arc(
        xAtom * (Date.now() - d.getTime()) / (1000*60*60),
        yOrigo - A.get_sun_altitude(new Date(), lat, long),
        sun_radius,
        0,
        2 * Math.PI,
        false
    )
    ctx.fill()

    # draw sun's path
    ctx.beginPath()
    ctx.strokeStyle = 'orange'
    ctx.moveTo 0, yOrigo - A.get_sun_altitude d, lat, long
    for i in [1 .. nPts]
        do ->
            ctx.lineTo(
                tAtom * xAtom * i,
                yOrigo - A.get_sun_altitude(
                    new Date(d.getTime() + i * tAtom * 1000 * 60 * 60),
                    lat,
                    long
                )
            )
    ctx.stroke()


update = ->
    draw(
        parseInt($('#time-input').value),
        parseInt($('#lat-input').value),
        parseInt($('#long-input').value)
    )

update()

$ '#time-input'
    .addEventListener 'input', update

$ '#lat-input'
    .addEventListener 'input', update

$ '#long-input'
    .addEventListener 'input', update
