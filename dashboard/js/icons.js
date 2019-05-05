function makeIcon(name, color) {

    if (name == "cross") {
        console.log("I am doing a cross")
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10' height='10'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='2' fill='none' " +
            " d='M 0,0 L 10,10 M 10,0 L 0,10 Z'/></svg>";
    }


    if (name == "cross2") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='20' height='20'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='1' fill='none' " +
            " d='M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z'/></svg>";
    }


    if (name == "plus") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='20' height='20'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='2' fill='none' d='M10,0 L10,20 '/> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='2' fill='none' d='M0,10 L20,10'/> " +
            "</svg>";
    }


    if (name == "plus2") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='4' height='4'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='0.25' fill='red' d='M2 1 h1 v1 h1 v1 h-1 v1 h-1 v-1 h-1 v-1 h1 z'/> " +
            "</svg>";
    }


    if (name == "asterisk") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10' height='10'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='1' fill='none' d='M4 0.5 L 4 7.5'/> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='1' fill='none' d='M1 2 L 7 6' /> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='1' fill='none' d='M7 2 L 1 6' /> " +
            " </svg>";
    }

    <!--if (name == "circle"){-->
    <!--// here's the SVG for the marker-->
    <!--var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='30' height=30'> " +-->
    <!--"<path stroke=" + "'" + color + "'" + " stroke-width='2' fill='none' " +-->
    <!--" d='M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0'/></svg>";-->
    <!--}-->


    if (name == "circle") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='20' height='20'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='1' fill='none' " +
            "d='M10,0.562c-5.195,0-9.406,4.211-9.406,9.406c0,5.195,4.211,9.406,9.406,9.406c5.195,0,9.406-4.211,9.406-9.406C19.406,4.774,15.195,0.562,10,0.562 M10,18.521c-4.723,0-8.551-3.829-8.551-8.552S5.277,1.418,10,1.418s8.552,3.828,8.552,8.551S14.723,18.521,10,18.521'/></svg>";
    }


    if (name == "square") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='20' height='20'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='M0 20 L20 20 L20 0 L0 0 Z'/></svg>";
    }


    if (name == "diamond") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='20' height='20'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='M10,1 5,10 10,19, 15,10Z'/></svg>";
    }


    if (name == "triangle-up") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='20' height='20'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='M 10,1 19,19.5 1,19.5 z'/></svg>"; //M0 20 L10 0 L20 20Z
    }


    if (name == "triangle-down") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='20' height='20'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='M10,19.5 19.5,1 0.5,1 Z'/></svg>"; //M0 0 L10 20 L20 0 Z
    }


    if (name == "triangle-right") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='20' height='20'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='2' fill='none' " +
            " d='M 19,10 1,19 1,1 z'/></svg>";

    }


    if (name == "triangle-left") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='20' height='20'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='2' fill='none' " +
            " d='M 1,10 19.5,1 19.5,19 Z'/></svg>";

    }


    if (name == "diamond2") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='20' height='20'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='M0 10, 10  0, 20 10, 10 20, 0 10'/></svg>";
    }



    if (name == "star") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='32' height='32'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='M32 12.408l-11.056-1.607-4.944-10.018-4.944 10.018-11.056 1.607 8 7.798-1.889 11.011 9.889-5.199 9.889 5.199-1.889-11.011 8-7.798zM16 23.547l-6.983 3.671 1.334-7.776-5.65-5.507 7.808-1.134 3.492-7.075 3.492 7.075 7.807 1.134-5.65 5.507 1.334 7.776-6.983-3.671z'/></svg>";
    }


    // four pointed star
    if (name == "star2") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='10' height='10'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='1' fill='none' " +
            " d='M5 1 Q5.8 4.2 9 5 Q5.8 5.8 5 9 Q4.2 5.8 1 5 Q4.2 4.2 5 1z'/></svg>";
    }


    if (name == "pentagon") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='38' height='38'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='M30,1 l6.180,19.021 l-16.180,11.756 l-16.180,-11.756 l6.180,-19.021 l20.000,0.000Z '/></svg>";

    }


    if (name == "hexagon") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='43' height='43'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='M 32 1     l 10.000 17.321     l -10.000 17.321     l -20.000 0.000     l -10.000 -17.321     l 10.000 -17.321     l 20.000 0.000Z'/></svg>";

    }


    if (name == "heptagon") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='49' height='49'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='M 35 2     l 12.470 15.637     l -4.450 19.499     l -18.019 8.678     l -18.019 -8.678     l -4.450 -19.499     l 12.470 -15.637     l 20.000 0.000Z'/></svg>";

    }


    if (name == "octagon") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='55' height='55'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d=' M 36 2     l 14.142 14.142     l 0.000 20.000     l -14.142 14.142     l -20.000 0.000     l -14.142 -14.142     l 0.000 -20.000     l 14.142 -14.142     l 20.000 0.000 Z'/></svg>";

    }


    if (name == "dodekagon") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='80' height='80'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='M 50 2     l 17.321 10.000     l 10.000 17.321     l 0.000 20.000     l -10.000 17.321     l -17.321 10.000     l -20.000 0.000     l -17.321 -10.000     l -10.000 -17.321     l 0.000 -20.000     l 10.000 -17.321     l 17.321 -10.000     l 20.000 0.000 Z'/></svg>";

    }

    // Based on http://www.smiffysplace.com/stars.html
    if (name == "6-pointed-star") {
        // here's the SVG for the marker
        var icon = "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='28' height='28'> " +
            "<path stroke=" + "'" + color + "'" + " stroke-width='3' fill='none' " +
            " d='m13 13m0 5l5 3.6599999999999966l-0.6700000000000017 -6.159999999999997l5.670000000000002 -2.5l-5.670000000000002 -2.5l0.6700000000000017 -6.159999999999997l-5 3.6599999999999966l-5 -3.6599999999999966l0.6700000000000017 6.159999999999997l-5.670000000000002 2.5l5.670000000000002 2.5l-0.6700000000000017 6.159999999999997z'/></svg>";

    }


    // here's the trick, base64 encode the URL
    var svgURL = "data:image/svg+xml;base64," + btoa(icon);

    // create icon
    var svgIcon = L.icon({
        iconUrl: svgURL,
        iconSize: [20, 20],
        shadowSize: [12, 10],
        iconAnchor: [5, 5],
        popupAnchor: [5, -5]
    });

    return svgIcon
}
