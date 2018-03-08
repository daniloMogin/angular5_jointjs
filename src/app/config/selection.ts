/*! Rappid v2.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2018-03-05 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import {ui} from '../../assets/build/rappid.min'

export const selection = {

    handles: [{
        name: 'remove',
        position: ui.Selection.HandlePosition.NW,
        events: {
            pointerdown: 'removeElements'
        },
        attrs: {
            '.handle': {
                'data-tooltip-class-name': 'small',
                'data-tooltip': 'Click to remove the selected elements',
                'data-tooltip-position': 'right',
                'data-tooltip-padding': 15
            }
        }

    }, {
        name: 'rotate',
        position: ui.Selection.HandlePosition.SW,
        events: {
            pointerdown: 'startRotating',
            pointermove: 'doRotate',
            pointerup: 'stopBatch'
        },
        attrs: {
            '.handle': {
                'data-tooltip-class-name': 'small',
                'data-tooltip': 'Click and drag to rotate the selected elements',
                'data-tooltip-position': 'right',
                'data-tooltip-padding': 15
            }
        }

    }, {
        name: 'resize',
        position: ui.Selection.HandlePosition.SE,
        events: {
            pointerdown: 'startResizing',
            pointermove: 'doResize',
            pointerup: 'stopBatch'
        },
        attrs: {
            '.handle': {
                'data-tooltip-class-name': 'small',
                'data-tooltip': 'Click and drag to resize the selected elements',
                'data-tooltip-position': 'left',
                'data-tooltip-padding': 15
            }
        }
    }]
};
