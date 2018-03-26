/*! Rappid v2.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2018-03-05 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import { ui } from '../../assets/build/rappid.min';

const asd: string = 'in1';
const asd1: string = 'in3';

export const stencil = {
    groups: <{ [key: string]: ui.Stencil.Group }>{
        basic: { index: 1, label: 'Shapes' },
    },
    shapes: {
        basic: [
            {
                type: 'app.RectangularModel',
                size: { width: 30, height: 20 },
                // inPorts: [asd, 'in2', asd1],
                // outPorts: ['out'],
                allowOrthogonalResize: false,
                attrs: {
                    '.': {
                        'data-tooltip': 'Rectangle with ports',
                        'data-tooltip-position': 'left',
                        'data-tooltip-position-selector': '.joint-stencil'
                    },
                    '.body': {
                        fill: 'transparent',
                        rx: 2,
                        ry: 2,
                        stroke: '#ffd600',
                        'stroke-width': 2,
                        'stroke-dasharray': '0'
                    },
                    '.label': {
                        text: '',
                        fill: '#c6c7e2',
                        'font-family': 'Roboto Condensed',
                        'font-weight': 'Normal',
                        'font-size': 11,
                        'stroke-width': 0,
                        'ref-y': 0.5,
                        'y-alignment': 'middle'
                    }
                }
            },
            {
                type: 'erd.IdentifyingRelationship',
                attrs: {
                    '.': {
                        'data-tooltip': 'Condition',
                        'data-tooltip-position': 'left',
                        'data-tooltip-position-selector': '.joint-stencil'
                    },
                    '.outer': {
                        fill: 'transparent',
                        stroke: '#ffd600',
                        'stroke-dasharray': '0'
                    },
                    '.inner': {
                        fill: 'transparent',
                        stroke: 'transparent',
                        'stroke-dasharray': '0'
                    },
                    text: {
                        text: '',
                        'font-size': 11,
                        'font-family': 'Roboto Condensed',
                        'font-weight': 'Normal',
                        fill: '#f6f6f6',
                        'stroke-width': 0
                    }
                }
            },
            {
                type: 'basic.Rect',
                size: { width: 2, height: 8 },
                attrs: {
                    '.': {
                        'data-tooltip': 'Rectangle',
                        'data-tooltip-position': 'left',
                        'data-tooltip-position-selector': '.joint-stencil'
                    },
                    rect: {
                        rx: 2,
                        ry: 2,
                        width: 50,
                        height: 30,
                        fill: 'transparent',
                        stroke: '#ffd600',
                        'stroke-width': 2,
                        'stroke-dasharray': '0'
                    },
                    text: {
                        // text: 'rect',
                        fill: '#c6c7e2',
                        'font-family': 'Roboto Condensed',
                        'font-weight': 'Normal',
                        'font-size': 11,
                        'stroke-width': 0
                    }
                }
            },
            {
                type: 'fsa.StartState',
                preserveAspectRatio: true,
                attrs: {
                    '.': {
                        'data-tooltip': 'Start State',
                        'data-tooltip-position': 'left',
                        'data-tooltip-position-selector': '.joint-stencil'
                    },
                    circle: {
                        width: 50,
                        height: 30,
                        fill: '#ffd600',
                        'stroke-width': 0
                    },
                    text: {
                        text: 'startState',
                        fill: '#c6c7e2',
                        'font-family': 'Roboto Condensed',
                        'font-weight': 'Normal',
                        'font-size': 11,
                        'stroke-width': 0
                    }
                }
            },
            {
                type: 'fsa.EndState',
                preserveAspectRatio: true,
                attrs: {
                    '.': {
                        'data-tooltip': 'End State',
                        'data-tooltip-position': 'left',
                        'data-tooltip-position-selector': '.joint-stencil'
                    },
                    '.inner': {
                        fill: '#ffff52',
                        stroke: 'transparent'
                    },
                    '.outer': {
                        fill: 'transparent',
                        stroke: '#ffd600',
                        'stroke-width': 2,
                        'stroke-dasharray': '0'
                    },
                    text: {
                        text: 'endState',
                        fill: '#c6c7e2',
                        'font-family': 'Roboto Condensed',
                        'font-weight': 'Normal',
                        'font-size': 11,
                        'stroke-width': 0
                    }
                }
            }
            // {
            //     type: 'app.CircularModel',
            //     size: { width: 5, height: 3 },
            //     // inPorts: ['in1', 'in2'],
            //     // outPorts: ['out'],
            //     allowOrthogonalResize: false,
            //     attrs: {
            //         '.': {
            //             'data-tooltip': 'Ellipse with ports',
            //             'data-tooltip-position': 'left',
            //             'data-tooltip-position-selector': '.joint-stencil'
            //         },
            //         '.body': {
            //             fill: 'transparent',
            //             stroke: '#ffd600',
            //             'stroke-width': 2,
            //             'stroke-dasharray': '0',
            //             'rx': '50%',
            //             'ry': '50%'
            //         },
            //         '.label': {
            //             text: '',
            //             fill: '#c6c7e2',
            //             'font-family': 'Roboto Condensed',
            //             'font-weight': 'Normal',
            //             'font-size': 11,
            //             'stroke-width': 0,
            //             'ref-y': 0.5,
            //             'y-alignment': 'middle'
            //         }
            //     }
            // },
            // {
            //     type: 'pn.Transition',
            //     preserveAspectRatio: true,
            //     attrs: {
            //         '.': {
            //             'data-tooltip': 'Transition',
            //             'data-tooltip-position': 'left',
            //             'data-tooltip-position-selector': '.joint-stencil'
            //         },
            //         rect: {
            //             rx: 3,
            //             ry: 3,
            //             width: 12,
            //             height: 175,
            //             fill: 'transparent',
            //             stroke: '#ffd600',
            //             'stroke-width': 2,
            //             'stroke-dasharray': '0'
            //         },
            //         '.label': {
            //             // text: 'transition',
            //             'font-family': 'Roboto Condensed',
            //             'font-weight': 'Normal',
            //             'stroke-width': 0,
            //             'fill': '#222138'
            //         }
            //     }
            // },
        ]
    }
}


