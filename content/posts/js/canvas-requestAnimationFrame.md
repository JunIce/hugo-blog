---
title: "canvas requestAnimationFrame画一个clock"
date: 2023-06-02T20:25:49+08:00
draft: false
tags: ["JS", "canvas"]
---

# canvas requestAnimationFrame 画一个 clock

````javascript

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var h1 = document.getElementsByTagName("h1")[0];
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');

    function getDateString(d) {
        return d.getFullYear() +
            '-' + ('0' + (d.getMonth() + 1)).slice(-2) +
            '-' + ('0' + d.getDate()).slice(-2) +
            ' ' + ('0' + d.getHours()).slice(-2) +
            ':' + ('0' + d.getMinutes()).slice(-2) +
            ':' + ('0' + d.getSeconds()).slice(-2) +
            '.' + ('00' + d.getMilliseconds()).slice(-3);
    }

    function drawline(width, r, angle) {
        var path = new Path2D();
        path.moveTo(canvas.width / 2, canvas.height / 2);
        path.lineTo(canvas.width / 2 - r * Math.cos(angle * 2 * Math.PI + Math.PI / 2), canvas.width / 2 - r * Math.sin(angle * 2 * Math.PI + Math.PI / 2));
        ctx.lineWidth = width;
        ctx.stroke(path);
    }

    requestAnimationFrame(function step(timestamp) {
        var d = new Date();
        var r_msec = d.getMilliseconds() / 1000;
        var r_seconds = (d.getSeconds() + r_msec) / 60;
        var r_minutes = (d.getMinutes() + r_seconds) / 60;
        var r_hours = (d.getHours() + r_minutes) / 12;

        h1.textContent = getDateString(d);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawline(10, 80, r_hours);
        drawline(5, 120, r_minutes);
        drawline(2, 150, r_seconds);
        // drawline(1, 180, r_msec);

        requestAnimationFrame(step);
    });
````
