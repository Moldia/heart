
L.Canvas.include({
    _updateMarkerStar6: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 8);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();
        ctx.moveTo(p.x + r     , p.y );
        ctx.lineTo(p.x + 0.43*r, p.y + 0.25 * r);
        ctx.lineTo(p.x + 0.50*r, p.y + 0.87 * r);
        ctx.lineTo(p.x         , p.y + 0.50 * r);
        ctx.lineTo(p.x - 0.50*r, p.y + 0.87 * r);
        ctx.lineTo(p.x - 0.43*r, p.y + 0.25 * r);
        ctx.lineTo(p.x -      r, p.y );
        ctx.lineTo(p.x - 0.43*r, p.y - 0.25 * r);
        ctx.lineTo(p.x - 0.50*r, p.y - 0.87 * r);
        ctx.lineTo(p.x         , p.y - 0.50 * r);
        ctx.lineTo(p.x + 0.50*r, p.y - 0.87 * r);
        ctx.lineTo(p.x + 0.43*r, p.y - 0.25 * r);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});


L.Canvas.include({
    _updateMarkerStar: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 8);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y + 0.658351875 * r);
        ctx.lineTo(p.x + 0.618027443 * r, p.y + 1 * r);
        ctx.lineTo(p.x + 0.5 * r, p.y + 0.27637816 * r);
        ctx.lineTo(p.x + 1 * r, p.y - 0.236080209 * r);
        ctx.lineTo(p.x + 0.309026865 * r, p.y - 0.341634306 * r);
        ctx.lineTo(p.x + 0 * r, p.y - 1 * r);
        ctx.lineTo(p.x -0.309026865 * r, p.y - 0.341634306 * r);
        ctx.lineTo(p.x -1 * r, p.y - 0.236080209 * r);
        ctx.lineTo(p.x -0.5 * r, p.y + 0.27637816 * r);
        ctx.lineTo(p.x -0.618027443 * r, p.y + 	1 * r);
        ctx.lineTo(p.x, p.y + 0.658351875 * r);
        ctx.closePath();
        this._fillStroke(ctx, layer);

    }
});

L.Canvas.include({
    _updateMarkerDiamond: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 6);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();
        ctx.moveTo(p.x-r, p.y);
        ctx.lineTo(p.x, p.y-r);
        ctx.lineTo(p.x+r, p.y);
        ctx.lineTo(p.x, p.y+r);
        ctx.lineTo(p.x-r, p.y);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});


L.Canvas.include({
    _updateMarkerSquare: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 5);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();
        ctx.moveTo(p.x-r, p.y-r);
        ctx.lineTo(p.x+r, p.y-r);
        ctx.lineTo(p.x+r, p.y+r);
        ctx.lineTo(p.x-r, p.y+r);
        ctx.lineTo(p.x-r, p.y-r);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});

L.Canvas.include({
    _updateMarkerTriangleUp: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 5);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();
        ctx.moveTo(p.x-r, p.y+r);
        ctx.lineTo(p.x, p.y-r);
        ctx.lineTo(p.x+r, p.y+r);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});


L.Canvas.include({
    _updateMarkerTriangleDown: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 5);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();

        ctx.moveTo(p.x - r, p.y - r);
        ctx.lineTo(p.x, p.y + r);
        ctx.lineTo(p.x + r, p.y - r);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});



L.Canvas.include({
    _updateMarkerTriangleRight: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 5);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();

        ctx.moveTo(p.x - r, p.y - r);
        ctx.lineTo(p.x+r, p.y);
        ctx.lineTo(p.x - r, p.y + r);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});


L.Canvas.include({
    _updateMarkerTriangleLeft: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 5);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();

        ctx.moveTo(p.x + r, p.y - r);
        ctx.lineTo(p.x - r, p.y);
        ctx.lineTo(p.x + r, p.y + r);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});


L.Canvas.include({
    _updateMarkerCross: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 5);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();

        ctx.moveTo(p.x + r, p.y + r);
        ctx.lineTo(p.x - r, p.y - r);
        ctx.moveTo(p.x - r, p.y + r);
        ctx.lineTo(p.x + r, p.y - r);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});



L.Canvas.include({
    _updateMarkerPlus: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 7);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();

        ctx.moveTo(p.x, p.y + r);
        ctx.lineTo(p.x, p.y - r);
        ctx.moveTo(p.x - r, p.y);
        ctx.lineTo(p.x + r, p.y);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});


L.Canvas.include({
    _updateMarkerAsterisk: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 7);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();

        ctx.moveTo(p.x, p.y + r);
        ctx.lineTo(p.x, p.y - r);
        ctx.moveTo(p.x - r, p.y);
        ctx.lineTo(p.x + r, p.y);
        ctx.moveTo(p.x + 0.5*r, p.y + 0.5*r);
        ctx.lineTo(p.x - 0.5*r, p.y - 0.5*r);
        ctx.moveTo(p.x - 0.5*r, p.y + 0.5*r);
        ctx.lineTo(p.x + 0.5*r, p.y - 0.5*r);
        ctx.arc(p.x, p.y, 2, 0, Math.PI*2, true);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});


L.Canvas.include({
    _updateMarkerCircle: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx,
            r = Math.max(Math.round(layer._radius), 6);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI*2, true);      
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});


L.Canvas.include({
    _updateMarkerDot: function (layer) {
        if (!this._drawing || layer._empty()) { return; }

        var p = layer._point,
            ctx = this._ctx;
            //r = Math.max(Math.round(layer._radius), 6);

        this._drawnLayers[layer._leaflet_id] = layer;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI*2, true);
        ctx.arc(p.x, p.y, 2, 0, Math.PI*2, true);
        ctx.closePath();
        this._fillStroke(ctx, layer);
    }
});

var svgGlyph = L.CircleMarker.extend({
     _updatePath: function() {
         if (this.options.shape === "star5")
             this._renderer._updateMarkerStar(this);
         if (this.options.shape === "star6")
             this._renderer._updateMarkerStar6(this);
         if (this.options.shape === "diamond")
             this._renderer._updateMarkerDiamond(this);
         if (this.options.shape === "square")
             this._renderer._updateMarkerSquare(this);
         if (this.options.shape === "triangleUp")
             this._renderer._updateMarkerTriangleUp(this);
         if (this.options.shape === "triangleDown")
             this._renderer._updateMarkerTriangleDown(this);
         if (this.options.shape === "triangleLeft")
             this._renderer._updateMarkerTriangleLeft(this);
         if (this.options.shape === "triangleRight")
             this._renderer._updateMarkerTriangleRight(this);
         if (this.options.shape === "cross")
             this._renderer._updateMarkerCross(this);
         if (this.options.shape === "plus")
             this._renderer._updateMarkerPlus(this);
         if (this.options.shape === "asterisk")
             this._renderer._updateMarkerAsterisk(this);
         if (this.options.shape === "circle")
             this._renderer._updateMarkerCircle(this);
         if (this.options.shape === "point")
             this._renderer._updateMarkerDot(this);         
     }
 });


