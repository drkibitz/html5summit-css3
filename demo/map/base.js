// good code design was traded for speed and getting something that runs *fast*
// thee have been warned

var level = {
    
    data : levelData
}

var dom = {

    tileWidth   : 64,
    tileHeight  : 64,
    
    viewPerspective : {
        current : 'top',
        
        top : {
            appendToTransform : ' rotateX(0) rotateZ(0)'
        },
        
        isometric : {
            appendToTransform : ' rotateX(30deg) rotateZ(10deg)'        
        }
    },

    constructLevel : function() {
        
        var tileXPos = 0,
            tileYPos = 0;
        
        for (var tileCount = 0; tileCount < levelData.tiles.length; tileCount++) {
        
            var tileData = levelData.tiles[tileCount];
                    
            var tileDOM = $('<div></div>');
            
            tileDOM
            .addClass('block')
            .css('-webkit-transform', 'translate3d(' + (tileXPos * dom.tileWidth) + 'px, ' + (tileYPos * dom.tileHeight) + 'px, 0)');
            
            tileDOM.bind('click', dom.onBlockClick);
            
            $('#scene').append(tileDOM);

            for (var floorCount = 0; floorCount < tileData.f.length; floorCount++) {
                var floorTile = tileData.f[floorCount];
                
                tileDOM.addClass(floorTile);
            }

            tileXPos++;
            if (tileXPos > levelData.width - 1) {
                tileXPos = 0;
                tileYPos++;
            }
            
            for (var wallCount = 0; wallCount < tileData.w.length; wallCount++) {
                var wallData = tileData.w[wallCount];
                
                var wallDOM = $('<div></div>');
                
                wallDOM
                .addClass('wall')
                .addClass(wallData);
                
                tileDOM.append(wallDOM);
            }
        }
    },
    
    onBlockClick : function(e) {
    
        console.log('onBlockClick');
        $(this).toggleClass('active');
    },
    
    onViewClick : function(e) {

        $('#scene').css('-webkit-transition', '-webkit-transform 1s ease-in-out');

        dom.viewPerspective.current = (dom.viewPerspective.current == 'top' ? 'isometric' : 'top');
        scene.moveTo(scene.x, scene.y);

    },
    
    init : function() {
        $('#ui_view').bind('click', dom.onViewClick);
        
        $('#scene').bind('webkitTransitionEnd', function() {
            $('#scene').css('-webkit-transition', 'none');    
        });
    }
}

var touch = {

    radiusForTouchToBeRegisteredAsDragging : 16,
    
    start : {
        x : 0, y : 0
    },

    last : {
        x: 0, y :0
    },
    
    isDragging : false,
    isButtonPressed : false,
    
    onTouchStart : function () {

        console.log('touchStart');

        touchX = touch.getTouchPosition()['x'];
        touchY = touch.getTouchPosition()['y'];

        console.log(touchX + ',' + touchY);

        touch.start.x = touchX;
        touch.start.y = touchY;
        
        touch.last.x = touchX;
        touch.last.y = touchY;
        
        touch.isButtonPressed = true;
    },

    onTouchMove : function () {
    
        if (!touch.isButtonPressed) {
            return false;
        }

        touchX = touch.getTouchPosition()['x'];
        touchY = touch.getTouchPosition()['y'];
            
        if (!touch.isDragging) {

            if ((Math.abs(touchX - touch.start.x) > touch.radiusForTouchToBeRegisteredAsDragging) ||
            (Math.abs(touchY - touch.start.y) > touch.radiusForTouchToBeRegisteredAsDragging)) {
                touch.isDragging = true;
            }
        } else {
        
            scene.moveBy(touchX - touch.last.x, touchY - touch.last.y);
       
            touch.last.x = touchX;
            touch.last.y = touchY;
        
        }
    },

    onTouchEnd : function () {

        touchX = touch.getTouchPosition()['x'];
        touchY = touch.getTouchPosition()['y'];

        touch.isDragging = false;    
        touch.isButtonPressed = false;
    },
    
    getTouchPositioniOS : function() {
    
        var x = event.touches[0].pageX;
        var y = event.touches[0].pageY;

        return { x : x, y : y};

    },
    
    getTouchPositionDesktop : function() {

        var x = window.event.clientX;
        var y = window.event.clientY;
    
        return { x : x, y : y};
    
    },
    
    getTouchPosition : function() {
        return { x: 0, y : 0 };
    },
    
    init : function() {
    
        if (device.isiPad || device.isiPhone) {
            touch.getTouchPosition = touch.getTouchPositioniOS;
        } else {
            touch.getTouchPosition = touch.getTouchPositionDesktop;
            $('body').addClass('desktop');
        }
        
        $('#container').bind('mousedown touchstart', touch.onTouchStart);
        $('#container').bind('mousemove touchmove', touch.onTouchMove);
        $('#container').bind('mouseup touchend', touch.onTouchEnd);   
        
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false); 
    }
}

var scene = {
    x : 0,
    y : 0,
    z : 0,
    
    moveTo : function(x, y) {
        
        scene.x = x;
        scene.y = y;
                
        $('#scene')
        .css('-webkit-transform', 
        'translate3d(' + x + 'px, ' + y + 'px, ' + scene.z + 'px)' + dom.viewPerspective[dom.viewPerspective.current].appendToTransform);
    },
    
    moveBy : function(x, y) {
        
        var x = scene.x + x;
        var y = scene.y + y;
        
        scene.moveTo(x, y);
    }
}

var device = {
    isiPad : false,
    isiPhone : false,
    isDesktop : false,
    
    init : function() {
        if (navigator.userAgent.indexOf('iPad') != -1) {
            device.isiPad = true;
        } else if (navigator.userAgent.indexOf('iPhone') != -1) {
            device.isiPhone = true;
        } else {
            device.isDesktop = true;
        }
    }
}

$(document).ready(function() {
    device.init();
    touch.init();
    dom.init();
    dom.constructLevel();
});