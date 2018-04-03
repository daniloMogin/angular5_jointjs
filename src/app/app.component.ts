import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as config from './config/configuration';
import * as _ from 'lodash';
import * as Backbone from 'backbone';

import '../models/joint.shapes.app';
import * as joint from '../assets/build/rappid.min';

let time1: any = 0;
let time2: any = 0;
let index: number = 0;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Geutebrueck Rappid';
    graph: joint.dia.Graph;
    commandManager: joint.dia.CommandManager;
    paper: joint.dia.Paper;
    snaplines: joint.ui.Snaplines;
    paperScroller: joint.ui.PaperScroller;
    stencil: joint.ui.Stencil;
    keyboard: joint.ui.Keyboard;
    clipboard: joint.ui.Clipboard;
    selection: joint.ui.Selection;
    toolbar: joint.ui.Toolbar;
    navigator: joint.ui.Navigator;

    ngOnInit() {
        this.initializePaper();
        this.initializeStencil();
        this.initializeSelection();
        this.initializeHaloAndInspector();
        this.initializeNavigator();
        this.initializeToolbar();
        this.initializeKeyboardShortcuts();
        this.initializeTooltips();
    }

    // Create a graph, paper and wrap the paper in a PaperScroller.
    initializePaper() {
        joint.setTheme('modern');
        const graph = this.graph = new joint.dia.Graph;

        const jsonString = {
            "cells": [{ "type": "basic.Circle", "size": { "width": 90, "height": 54 }, "position": { "x": 110, "y": 100 }, "angle": 0, "id": "0bbd0dc7-bac8-4327-8f34-4fc6ebfbec50", "z": 1, "attrs": { "circle": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "font-size": 16, "text": "Start", "fill": "#222138", "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 110, "y": 204 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "cee7b5ba-cc82-4069-8dac-dac0ec7f8d63", "z": 2, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#222138", "text": "Opened", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 110, "y": 308 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "b3531991-aaa2-43d8-94ad-3adc86f25746", "z": 3, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#222138", "text": "Verified", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "cee7b5ba-cc82-4069-8dac-dac0ec7f8d63" }, "target": { "id": "b3531991-aaa2-43d8-94ad-3adc86f25746" }, "id": "ebafcd9f-1b25-4a16-affc-9183b0a3a40f", "z": 4, "labels": [{ "attrs": { "text": { "text": "Verify" } }, "position": 0.5 }], "vertices": [{ "x": 155, "y": 283 }], "attrs": {} }, { "type": "basic.Rect", "position": { "x": 110, "y": 412 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "a93d25d0-87c1-4742-b901-1106f5c16c78", "z": 5, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#222138", "text": "Playing", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "b3531991-aaa2-43d8-94ad-3adc86f25746" }, "target": { "id": "a93d25d0-87c1-4742-b901-1106f5c16c78" }, "id": "e8e72a8a-8569-4648-8bf5-20e80eadf40a", "z": 6, "labels": [{ "attrs": { "text": { "text": "Play" } }, "position": 0.5 }], "vertices": [{ "x": 155, "y": 387 }], "attrs": {} }, { "type": "basic.Rect", "position": { "x": 140, "y": 516 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "4bce2379-8ede-48bc-968e-45c9e95f87b2", "z": 7, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#222138", "text": "Paused", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "a93d25d0-87c1-4742-b901-1106f5c16c78" }, "target": { "id": "4bce2379-8ede-48bc-968e-45c9e95f87b2" }, "id": "66e6b65c-0327-43f1-959e-e1d4c1ac7311", "z": 8, "vertices": [{ "x": 155, "y": 491 }], "labels": [{ "attrs": { "text": { "text": "Pause" } }, "position": 0.5 }], "attrs": {} }, { "type": "basic.Circle", "size": { "width": 90, "height": 54 }, "position": { "x": 100, "y": 620 }, "angle": 0, "id": "396f191a-ce20-452a-8f87-37e4e3fe4bfe", "z": 9, "attrs": { "circle": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "font-size": 16, "text": "End", "fill": "#222138", "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "0bbd0dc7-bac8-4327-8f34-4fc6ebfbec50" }, "target": { "id": "cee7b5ba-cc82-4069-8dac-dac0ec7f8d63" }, "id": "cbe0a327-febb-4ab1-86b5-219c15dac6e8", "z": 10, "labels": [{ "attrs": { "text": { "text": "Start" } }, "position": 0.5 }], "vertices": [{ "x": 155, "y": 179 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "a93d25d0-87c1-4742-b901-1106f5c16c78" }, "target": { "id": "396f191a-ce20-452a-8f87-37e4e3fe4bfe" }, "id": "8e6c1a0a-66c4-49ee-96e3-399221ed8a89", "z": 12, "vertices": [{ "x": 105, "y": 491 }, { "x": 105, "y": 543 }, { "x": 105, "y": 595 }], "labels": [{ "attrs": { "text": { "text": "Stop" } }, "position": 0.5 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "4bce2379-8ede-48bc-968e-45c9e95f87b2" }, "target": { "id": "396f191a-ce20-452a-8f87-37e4e3fe4bfe" }, "id": "3966e856-f017-488c-b288-f1ab3453a224", "z": 13, "vertices": [{ "x": 185, "y": 595 }], "labels": [{ "attrs": { "text": { "text": "Stop" } }, "position": 0.5 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "4bce2379-8ede-48bc-968e-45c9e95f87b2" }, "target": { "id": "a93d25d0-87c1-4742-b901-1106f5c16c78" }, "id": "b586b675-8330-413e-9b48-979a1d826e6a", "z": 14, "vertices": [{ "x": 195, "y": 491 }], "labels": [{ "attrs": { "text": { "text": "Play" } }, "position": 0.5 }], "attrs": {} }]
        }

        // graph.on('add', (cell: joint.dia.Cell, collection: any, opt: any) => {
        //     console.log(`cell??????????????????`);
        //     console.log(cell);

        //     if (opt.stencil) this.createInspector(cell);
        // });

        this.commandManager = new joint.dia.CommandManager({ graph: graph });

        const paper = this.paper = new joint.dia.Paper({
            width: 1000,
            height: 1000,
            gridSize: 10,
            drawGrid: true,
            model: graph,
            defaultLink: new joint.shapes.app.Link()
        });

        paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
        paper.on('cell:mousewheel', this.onMousewheel.bind(this));

        this.snaplines = new joint.ui.Snaplines({ paper: paper });

        const paperScroller = this.paperScroller = new joint.ui.PaperScroller({
            paper,
            autoResizePaper: true,
            cursor: 'grab'
        });

        $('.paper-container').append(paperScroller.el);

        paperScroller.render().center();
        // graph.fromJSON(jsonString)
    }

    // Create and populate stencil.
    initializeStencil() {

        const stencil = this.stencil = new joint.ui.Stencil({
            paper: this.paperScroller,
            snaplines: this.snaplines,
            scaleClones: true,
            width: 240,
            groups: config.stencil.groups,
            dropAnimation: true,
            groupsToggleButtons: true,
            search: {
                '*': ['type', 'attrs/text/text', 'attrs/.label/text'],
                'org.Member': ['attrs/.rank/text', 'attrs/.name/text']
            },
            // Use default Grid Layout
            layout: true,
            // Remove tooltip definition from clone
            dragStartClone: (cell: joint.dia.Cell) => cell.clone().removeAttr('./data-tooltip')
        });

        $('.stencil-container').append(stencil.el);
        stencil.render().load(config.stencil.shapes);
    }

    // Create keyboard schortcuts
    initializeKeyboardShortcuts() {

        this.keyboard = new joint.ui.Keyboard();
        this.keyboard.on({

            'ctrl+c': () => {

                // Copy all selected elements and their associated links.
                this.clipboard.copyElements(this.selection.collection, this.graph);
            },

            'ctrl+v': () => {

                const pastedCells = this.clipboard.pasteCells(this.graph, {
                    translate: { dx: 20, dy: 20 },
                    useLocalStorage: true
                });

                const elements = _.filter(pastedCells, cell => cell.isElement());

                // Make sure pasted elements get selected immediately. This makes the UX better as
                // the user can immediately manipulate the pasted elements.
                this.selection.collection.reset(elements);
            },

            'ctrl+x shift+delete': () => {
                this.clipboard.cutElements(this.selection.collection, this.graph);
            },

            'delete backspace': (evt: JQuery.Event) => {
                evt.preventDefault();
                this.graph.removeCells(this.selection.collection.toArray());
            },

            'ctrl+z': () => {
                this.commandManager.undo();
                this.selection.cancelSelection();
            },

            'ctrl+y': () => {
                this.commandManager.redo();
                this.selection.cancelSelection();
            },

            'ctrl+a': () => {
                this.selection.collection.reset(this.graph.getElements());
            },

            'ctrl+plus': (evt: JQuery.Event) => {
                evt.preventDefault();
                this.paperScroller.zoom(0.2, { max: 5, grid: 0.2 });
            },

            'ctrl+minus': (evt: JQuery.Event) => {
                evt.preventDefault();
                this.paperScroller.zoom(-0.2, { min: 0.2, grid: 0.2 });
            },

            'keydown:shift': (evt: JQuery.Event) => {
                this.paperScroller.setCursor('crosshair');
            },

            'keyup:shift': () => {
                this.paperScroller.setCursor('grab');
            }
        });
    }

    // Selection single element and selecting multi elements with holding shift
    initializeSelection() {

        this.clipboard = new joint.ui.Clipboard();
        this.selection = new joint.ui.Selection({
            paper: this.paper,
            handles: config.selection.handles
        });

        // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
        // Otherwise, initiate paper pan.
        this.paper.on('blank:pointerdown', (evt: JQuery.Event, x: number, y: number) => {
            if (this.keyboard.isActive('shift', evt)) {
                this.selection.startSelecting(evt);
            } else {
                this.selection.cancelSelection();
                this.paperScroller.startPanning(evt);
            }

        });

        this.paper.on('element:pointerdown', (elementView: joint.dia.ElementView, evt: JQuery.Event) => {

            // Select an element if CTRL/Meta key is pressed while the element is clicked.
            if (this.keyboard.isActive('ctrl meta', evt)) {
                this.selection.collection.add(elementView.model);
            }

        });

        this.selection.on('selection-box:pointerdown', (elementView: joint.dia.ElementView, evt: JQuery.Event) => {

            // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
            if (this.keyboard.isActive('ctrl meta', evt)) {
                this.selection.collection.remove(elementView.model);
            }

        });
    }

    createInspector(cell: joint.dia.Cell) {
        cell.on('change:attrs', input => {
            const actions = getActions();
            if (input.attributes.type === 'app.RectangularModel') {
                if (!input.hasPorts()) {
                    addPortsToElement(actions, input);
                } else {
                    removePortsFromElement(input);
                    addPortsToElement(actions, input);
                }
            }
        });

        return joint.ui.Inspector.create('.inspector-container', _.extend({ cell }, config.inspector[cell.get('type')]));
    }

    // Click on element create frame with functions for manipulating size, link...
    initializeHaloAndInspector() {
        this.paper.on('element:pointerup link:options', (cellView: joint.dia.CellView) => {
            const cell = cellView.model;
            if (!this.selection.collection.contains(cell)) {

                if (cell.isElement()) {
                    if (cell.attributes.type === 'app.RectangularModel') {
                        new joint.ui.FreeTransform({
                            cellView,
                            allowRotation: false,
                            preserveAspectRatio: !!cell.get('preserveAspectRatio'),
                            allowOrthogonalResize: cell.get('allowOrthogonalResize') !== false
                        }).render();

                        new joint.ui.Halo({
                            cellView,
                            handles: config.haloNoLink.handles
                        }).render();
                    } else {
                        new joint.ui.FreeTransform({
                            cellView,
                            allowRotation: false,
                            preserveAspectRatio: !!cell.get('preserveAspectRatio'),
                            allowOrthogonalResize: cell.get('allowOrthogonalResize') !== false
                        }).render();

                        new joint.ui.Halo({
                            cellView,
                            handles: config.halo.handles
                        }).render();
                    }

                    this.selection.collection.reset([]);
                    this.selection.collection.add(cell, { silent: true });
                }

                this.createInspector(cell);
            }
        });
    }

    // Minimap for designer
    initializeNavigator() {

        const navigator = this.navigator = new joint.ui.Navigator({
            width: 240,
            height: 115,
            paperScroller: this.paperScroller,
            zoom: false
        });

        $('.navigator-container').append(navigator.el);
        navigator.render();
    }

    // Create toolbar with all desired options
    initializeToolbar() {

        const toolbar = this.toolbar = new joint.ui.Toolbar({
            groups: config.toolbar.groups,
            tools: config.toolbar.tools,
            references: {
                paperScroller: this.paperScroller,
                commandManager: this.commandManager
            }
        });

        toolbar.on({
            'svg:pointerclick': () => this.openAsSVG(),
            'png:pointerclick': () => this.openAsPNG(),
            'to-front:pointerclick': () => this.selection.collection.invoke('toFront'),
            'to-back:pointerclick': () => this.selection.collection.invoke('toBack'),
            'layout:pointerclick': () => this.layoutDirectedGraph(),
            'snapline:change': (checked: boolean) => this.changeSnapLines(checked),
            'clear:pointerclick': () => this.graph.clear(),
            'print:pointerclick': () => this.paper.print(),
            'grid-size:change': (size: number) => this.paper.setGridSize(size)
        });

        $('.toolbar-container').append(toolbar.el);
        toolbar.render();
    }

    // Turn on/off snaping to other elements on drag
    changeSnapLines(checked: boolean) {

        if (checked) {
            this.snaplines.startListening();
            this.stencil.options.snaplines = this.snaplines;
        } else {
            this.snaplines.stopListening();
            this.stencil.options.snaplines = null;
        }
    }

    // Adding tooltips on all designer UI
    initializeTooltips() {

        new joint.ui.Tooltip({
            rootTarget: document.body,
            target: '[data-tooltip]',
            direction: joint.ui.Tooltip.TooltipArrowPosition.Auto,
            padding: 10
        });
    }

    openAsSVG() {

        this.paper.toSVG((svg: string) => {
            new joint.ui.Lightbox({
                title: '(Right-click, and use "Save As" to save the diagram in SVG format)',
                image: 'data:image/svg+xml,' + encodeURIComponent(svg)
            }).open();
        }, { preserveDimensions: true, convertImagesToDataUris: true });
    }

    openAsPNG() {

        this.paper.toPNG((dataURL: string) => {
            new joint.ui.Lightbox({
                title: '(Right-click, and use "Save As" to save the diagram in PNG format)',
                image: dataURL
            }).open();
        }, { padding: 10 });
    }

    onMousewheel(cellView: joint.dia.CellView, evt: JQuery.Event, ox: number, oy: number, delta: number) {

        if (this.keyboard.isActive('alt', evt)) {
            evt.preventDefault();
            this.paperScroller.zoom(delta * 0.2, { min: 0.2, max: 5, grid: 0.2, ox, oy });
        }
    }

    // Creating auto layout
    layoutDirectedGraph() {

        joint.layout.DirectedGraph.layout(this.graph, {
            setVertices: true,
            rankDir: 'TB',
            marginX: 100,
            marginY: 100
        });

        this.paperScroller.centerContent();
    }

    public saveToJSON() {
        console.log(`saveToJSON`);

        const actions = getActions();
        console.log(`actions`);
        console.log(actions.Operations);
        // console.log(actions.length);

        const jsonString = JSON.stringify(this.graph);
        const jsonObj = this.graph;
        // console.log(`jsonString`);
        // console.log(jsonString);
        console.log(`jsonObj`);
        console.log(jsonObj.attributes.cells.models);

        const test = combineJson(jsonObj, actions);

        // for (let i: number = 0; i < jsonObj_length; i++) {
        //     for (let j: number = 0; j < actions_len; j++) {
        //         if (jsonObj.attributes.cells.models[i].attributes.attrs['.label'].text == actions.Operations[j].OperationId) {
        //             test.push({...jsonObj.attributes.cells.models[i], ...actions.Operations[j]})
        //         }
        //     }
        // }
        console.log(`test`);
        console.log(test);
    }

    public loadFromJSON() {
        console.log(`loadFromJSON`);
        // const jsonString = JSON.stringify(this.graph);
        // console.log(jsonString);

        // TODO - logic for getting diagram from database
        const jsonString: any = {
            "cells": [{ "type": "fsa.State", "size": { "width": 60, "height": 60 }, "position": { "x": 245, "y": 10 }, "angle": 0, "preserveAspectRatio": true, "id": "94d10cb9-16e3-4804-a323-543907115020", "z": 1, "attrs": { "circle": { "stroke-width": 2, "fill": "#33334e", "stroke": "#61549C", "stroke-dasharray": "0" }, "text": { "font-weight": "Normal", "font-size": 16, "text": "Init", "fill": "#f6f6f6", "font-family": "Roboto Condensed", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "fsa.State", "size": { "width": 60, "height": 60 }, "position": { "x": 50, "y": 304 }, "angle": 0, "preserveAspectRatio": true, "id": "e9dcaff1-e8da-40d0-ac91-6f3349a8226d", "z": 2, "attrs": { "circle": { "stroke-width": 2, "fill": "#33334e", "stroke": "#61549C", "stroke-dasharray": "0" }, "text": { "font-weight": "Normal", "font-size": 16, "text": "End", "fill": "#f6f6f6", "font-family": "Roboto Condensed", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 35, "y": 210 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "9bbe88a1-80c2-494b-885b-a70a2e1c8d7d", "z": 3, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "Shutdown()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 230, "y": 110 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "44436805-6acd-4fc6-be26-452cb1258990", "z": 4, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "Initialize()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 225, "y": 212 }, "size": { "width": 100, "height": 50 }, "angle": 0, "id": "e8d0fb94-a6b4-4750-8aa6-ec80954544c7", "z": 5, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "WaitOnAlarm()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 230, "y": 307 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "d6a95b6d-ce11-41f3-b4a0-57dab12c9394", "z": 6, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "Alarm()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 385, "y": 307 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "80fcf7ab-ddb8-49f9-8352-521d3b9d27bb", "z": 7, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "Assignment()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 210, "y": 514 }, "size": { "width": 130, "height": 50 }, "angle": 0, "id": "682e6269-d0f5-4206-9b41-d80850c40f1f", "z": 8, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "CheckIfRowsFree()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 70, "y": 450 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "e4b1f19c-a03f-4cd3-aaab-66faa8a8e2a5", "z": 9, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "Decrement()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 70, "y": 587 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "5fe28ea1-aafb-4001-a8a4-339f0a0129e6", "z": 10, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "ClearRow()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 585, "y": 309 }, "size": { "width": 160, "height": 50 }, "angle": 0, "id": "d1cbc24f-34e9-49e3-b486-1b95075b34d0", "z": 11, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "MoveFromRowToRow()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 620, "y": 514 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "e65b5857-632d-4727-a6d2-c22474916bb4", "z": 12, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "ShowRow()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "erd.Relationship", "size": { "width": 60, "height": 60 }, "position": { "x": 245, "y": 404 }, "angle": 0, "id": "dea91981-81fd-4783-9160-03031ba8d49c", "z": 13, "attrs": { ".outer": { "fill": "#f6f6f6", "stroke": "#31d0c6", "stroke-dasharray": "0" }, "text": { "text": "Relation", "font-family": "Roboto Condensed", "font-size": 16, "font-weight": "Normal", "fill": "#33334e", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "erd.Relationship", "size": { "width": 60, "height": 60 }, "position": { "x": 635, "y": 80 }, "angle": 0, "id": "5bf0c793-f5b1-4007-a4ff-d05237d47dd8", "z": 14, "attrs": { ".outer": { "fill": "#f6f6f6", "stroke": "#31d0c6", "stroke-dasharray": "0" }, "text": { "text": "Relation", "font-family": "Roboto Condensed", "font-size": 16, "font-weight": "Normal", "fill": "#33334e", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "erd.Relationship", "size": { "width": 60, "height": 60 }, "position": { "x": 635, "y": 207 }, "angle": 0, "id": "f5de14b5-57a6-4b24-bca7-300b86efb829", "z": 15, "attrs": { ".outer": { "fill": "#f6f6f6", "stroke": "#31d0c6", "stroke-dasharray": "0" }, "text": { "text": "Relation", "font-family": "Roboto Condensed", "font-size": 16, "font-weight": "Normal", "fill": "#33334e", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "erd.Relationship", "size": { "width": 60, "height": 60 }, "position": { "x": 635, "y": 404 }, "angle": 0, "id": "a5eb0f0b-9e26-49af-b3de-0adb2ae72676", "z": 16, "attrs": { ".outer": { "fill": "#f6f6f6", "stroke": "#31d0c6", "stroke-dasharray": "0" }, "text": { "text": "Relation", "font-family": "Roboto Condensed", "font-size": 16, "font-weight": "Normal", "fill": "#33334e", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "94d10cb9-16e3-4804-a323-543907115020" }, "target": { "id": "44436805-6acd-4fc6-be26-452cb1258990" }, "id": "c81fd811-62fc-44b2-bbcb-a60bd9bad8eb", "z": 17, "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "44436805-6acd-4fc6-be26-452cb1258990" }, "target": { "id": "e8d0fb94-a6b4-4750-8aa6-ec80954544c7" }, "id": "70fa9222-90f4-414c-b6ba-52cd16a6742e", "z": 18, "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "e8d0fb94-a6b4-4750-8aa6-ec80954544c7" }, "target": { "id": "9bbe88a1-80c2-494b-885b-a70a2e1c8d7d" }, "id": "b903e03c-7b1f-419e-b2ba-6f13d0daaf74", "z": 19, "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "9bbe88a1-80c2-494b-885b-a70a2e1c8d7d" }, "target": { "id": "e9dcaff1-e8da-40d0-ac91-6f3349a8226d" }, "id": "04a76cb2-9d4c-4ea9-998d-1e0b77611c28", "z": 20, "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "e8d0fb94-a6b4-4750-8aa6-ec80954544c7" }, "target": { "id": "d6a95b6d-ce11-41f3-b4a0-57dab12c9394" }, "id": "d66a1f38-499b-4b49-9d6f-a029698566df", "z": 21, "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "d6a95b6d-ce11-41f3-b4a0-57dab12c9394" }, "target": { "id": "dea91981-81fd-4783-9160-03031ba8d49c" }, "id": "52c1b600-4f27-4b91-ac27-155445f24baf", "z": 22, "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "dea91981-81fd-4783-9160-03031ba8d49c" }, "target": { "id": "80fcf7ab-ddb8-49f9-8352-521d3b9d27bb" }, "id": "29f25811-fc77-4c11-90ee-757642245935", "z": 23, "vertices": [{ "x": 430, "y": 430 }], "labels": [{ "attrs": { "text": { "text": "NO" } }, "position": 30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "80fcf7ab-ddb8-49f9-8352-521d3b9d27bb" }, "target": { "id": "e8d0fb94-a6b4-4750-8aa6-ec80954544c7" }, "id": "809f432f-532d-479f-af0e-aae9f0fc0d40", "z": 24, "vertices": [{ "x": 430, "y": 240 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "dea91981-81fd-4783-9160-03031ba8d49c" }, "target": { "id": "682e6269-d0f5-4206-9b41-d80850c40f1f" }, "id": "022dfafa-fdd4-4d20-9032-7dfeb6baca0a", "z": 25, "labels": [{ "attrs": { "text": { "text": "YES" } }, "position": -30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "682e6269-d0f5-4206-9b41-d80850c40f1f" }, "target": { "id": "5bf0c793-f5b1-4007-a4ff-d05237d47dd8" }, "id": "c8608522-bf4d-4ac8-baf5-dbb0d4dc045c", "z": 26, "vertices": [{ "x": 490, "y": 540 }, { "x": 490, "y": 30 }, { "x": 660, "y": 30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "5bf0c793-f5b1-4007-a4ff-d05237d47dd8" }, "target": { "id": "f5de14b5-57a6-4b24-bca7-300b86efb829" }, "id": "e12f6940-2d51-404f-8774-68dfd65486d5", "z": 27, "labels": [{ "attrs": { "text": { "text": "NO" } }, "position": -30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "f5de14b5-57a6-4b24-bca7-300b86efb829" }, "target": { "id": "d1cbc24f-34e9-49e3-b486-1b95075b34d0" }, "id": "2b877535-00a6-494a-b7d8-e082cd08b5cd", "z": 28, "labels": [{ "attrs": { "text": { "text": "NO" } }, "position": 30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "d1cbc24f-34e9-49e3-b486-1b95075b34d0" }, "target": { "id": "a5eb0f0b-9e26-49af-b3de-0adb2ae72676" }, "id": "016a36ba-9f0b-49d6-afa5-5084780b5fcf", "z": 29, "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "a5eb0f0b-9e26-49af-b3de-0adb2ae72676" }, "target": { "id": "e65b5857-632d-4727-a6d2-c22474916bb4" }, "id": "5299a197-7585-4576-80b2-052c3735c443", "z": 30, "labels": [{ "attrs": { "text": { "text": "YES" } }, "position": -30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "e65b5857-632d-4727-a6d2-c22474916bb4" }, "target": { "id": "e4b1f19c-a03f-4cd3-aaab-66faa8a8e2a5" }, "id": "20b2f099-726c-454e-9a08-b62f1c0a074d", "z": 31, "vertices": [{ "x": 670, "y": 710 }, { "x": 10, "y": 710 }, { "x": 10, "y": 410 }, { "x": 110, "y": 410 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "a5eb0f0b-9e26-49af-b3de-0adb2ae72676" }, "target": { "id": "e4b1f19c-a03f-4cd3-aaab-66faa8a8e2a5" }, "id": "2f66e0e9-6fcc-4a04-8dba-92e3a638946d", "z": 32, "vertices": [{ "x": 580, "y": 430 }, { "x": 580, "y": 700 }, { "x": 20, "y": 700 }, { "x": 20, "y": 470 }], "labels": [{ "attrs": { "text": { "text": "NO" } }, "position": 30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "5bf0c793-f5b1-4007-a4ff-d05237d47dd8" }, "target": { "id": "e4b1f19c-a03f-4cd3-aaab-66faa8a8e2a5" }, "id": "34b7fc72-de45-4538-90fe-cfbd43c877ca", "z": 33, "vertices": [{ "x": 510, "y": 110 }, { "x": 510, "y": 580 }, { "x": 190, "y": 580 }, { "x": 190, "y": 480 }], "labels": [{ "attrs": { "text": { "text": "YES" } }, "position": 30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "5fe28ea1-aafb-4001-a8a4-339f0a0129e6" }, "target": { "id": "e4b1f19c-a03f-4cd3-aaab-66faa8a8e2a5" }, "id": "ad5334e0-465a-407d-a92d-136cf0f14ec8", "z": 34, "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "f5de14b5-57a6-4b24-bca7-300b86efb829" }, "target": { "id": "5fe28ea1-aafb-4001-a8a4-339f0a0129e6" }, "id": "42eb0f71-f733-4a63-acdc-34028c66c65c", "z": 35, "vertices": [{ "x": 530, "y": 240 }, { "x": 530, "y": 610 }], "labels": [{ "attrs": { "text": { "text": "YES" } }, "position": 30 }], "attrs": {} }]
        }

        const jsonString1: any = {
            "cells": [{ "type": "fsa.State", "size": { "width": 60, "height": 60 }, "position": { "x": 242.5, "y": 100 }, "angle": 0, "preserveAspectRatio": true, "id": "94d10cb9-16e3-4804-a323-543907115020", "z": 1, "attrs": { "circle": { "stroke-width": 2, "fill": "#33334e", "stroke": "#61549C", "stroke-dasharray": "0" }, "text": { "font-weight": "Normal", "font-size": 16, "text": "Init", "fill": "#f6f6f6", "font-family": "Roboto Condensed", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "fsa.State", "size": { "width": 60, "height": 60 }, "position": { "x": 115, "y": 518 }, "angle": 0, "preserveAspectRatio": true, "id": "e9dcaff1-e8da-40d0-ac91-6f3349a8226d", "z": 2, "attrs": { "circle": { "stroke-width": 2, "fill": "#33334e", "stroke": "#61549C", "stroke-dasharray": "0" }, "text": { "font-weight": "Normal", "font-size": 16, "text": "End", "fill": "#f6f6f6", "font-family": "Roboto Condensed", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 100, "y": 414 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "9bbe88a1-80c2-494b-885b-a70a2e1c8d7d", "z": 3, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "Shutdown()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 227.5, "y": 210 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "44436805-6acd-4fc6-be26-452cb1258990", "z": 4, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "Initialize()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 222.5, "y": 314 }, "size": { "width": 100, "height": 50 }, "angle": 0, "id": "e8d0fb94-a6b4-4750-8aa6-ec80954544c7", "z": 5, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "WaitOnAlarm()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 240, "y": 414 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "d6a95b6d-ce11-41f3-b4a0-57dab12c9394", "z": 6, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "Alarm()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 240, "y": 628 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "80fcf7ab-ddb8-49f9-8352-521d3b9d27bb", "z": 7, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "Assignment()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 380, "y": 630 }, "size": { "width": 130, "height": 50 }, "angle": 0, "id": "682e6269-d0f5-4206-9b41-d80850c40f1f", "z": 8, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "CheckIfRowsFree()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 427.5, "y": 1266 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "e4b1f19c-a03f-4cd3-aaab-66faa8a8e2a5", "z": 9, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "Decrement()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 467.5, "y": 1162 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "5fe28ea1-aafb-4001-a8a4-339f0a0129e6", "z": 10, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "ClearRow()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 295, "y": 952 }, "size": { "width": 160, "height": 50 }, "angle": 0, "id": "d1cbc24f-34e9-49e3-b486-1b95075b34d0", "z": 11, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "MoveFromRowToRow()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 290, "y": 1162 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "e65b5857-632d-4727-a6d2-c22474916bb4", "z": 12, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#33334e", "text": "ShowRow()", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "erd.Relationship", "size": { "width": 60, "height": 60 }, "position": { "x": 255, "y": 518 }, "angle": 0, "id": "dea91981-81fd-4783-9160-03031ba8d49c", "z": 13, "attrs": { ".outer": { "fill": "#f6f6f6", "stroke": "#31d0c6", "stroke-dasharray": "0" }, "text": { "text": "Relation", "font-family": "Roboto Condensed", "font-size": 16, "font-weight": "Normal", "fill": "#33334e", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "erd.Relationship", "size": { "width": 60, "height": 60 }, "position": { "x": 415, "y": 732 }, "angle": 0, "id": "5bf0c793-f5b1-4007-a4ff-d05237d47dd8", "z": 14, "attrs": { ".outer": { "fill": "#f6f6f6", "stroke": "#31d0c6", "stroke-dasharray": "0" }, "text": { "text": "Relation", "font-family": "Roboto Condensed", "font-size": 16, "font-weight": "Normal", "fill": "#33334e", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "erd.Relationship", "size": { "width": 60, "height": 60 }, "position": { "x": 402.5, "y": 842 }, "angle": 0, "id": "f5de14b5-57a6-4b24-bca7-300b86efb829", "z": 15, "attrs": { ".outer": { "fill": "#f6f6f6", "stroke": "#31d0c6", "stroke-dasharray": "0" }, "text": { "text": "Relation", "font-family": "Roboto Condensed", "font-size": 16, "font-weight": "Normal", "fill": "#33334e", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "erd.Relationship", "size": { "width": 60, "height": 60 }, "position": { "x": 345, "y": 1052 }, "angle": 0, "id": "a5eb0f0b-9e26-49af-b3de-0adb2ae72676", "z": 16, "attrs": { ".outer": { "fill": "#f6f6f6", "stroke": "#31d0c6", "stroke-dasharray": "0" }, "text": { "text": "Relation", "font-family": "Roboto Condensed", "font-size": 16, "font-weight": "Normal", "fill": "#33334e", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "94d10cb9-16e3-4804-a323-543907115020" }, "target": { "id": "44436805-6acd-4fc6-be26-452cb1258990" }, "id": "c81fd811-62fc-44b2-bbcb-a60bd9bad8eb", "z": 17, "vertices": [{ "x": 272.5, "y": 185 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "44436805-6acd-4fc6-be26-452cb1258990" }, "target": { "id": "e8d0fb94-a6b4-4750-8aa6-ec80954544c7" }, "id": "70fa9222-90f4-414c-b6ba-52cd16a6742e", "z": 18, "vertices": [{ "x": 272.5, "y": 289 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "e8d0fb94-a6b4-4750-8aa6-ec80954544c7" }, "target": { "id": "9bbe88a1-80c2-494b-885b-a70a2e1c8d7d" }, "id": "b903e03c-7b1f-419e-b2ba-6f13d0daaf74", "z": 19, "vertices": [{ "x": 145, "y": 389 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "9bbe88a1-80c2-494b-885b-a70a2e1c8d7d" }, "target": { "id": "e9dcaff1-e8da-40d0-ac91-6f3349a8226d" }, "id": "04a76cb2-9d4c-4ea9-998d-1e0b77611c28", "z": 20, "vertices": [{ "x": 145, "y": 493 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "e8d0fb94-a6b4-4750-8aa6-ec80954544c7" }, "target": { "id": "d6a95b6d-ce11-41f3-b4a0-57dab12c9394" }, "id": "d66a1f38-499b-4b49-9d6f-a029698566df", "z": 21, "vertices": [{ "x": 285, "y": 389 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "d6a95b6d-ce11-41f3-b4a0-57dab12c9394" }, "target": { "id": "dea91981-81fd-4783-9160-03031ba8d49c" }, "id": "52c1b600-4f27-4b91-ac27-155445f24baf", "z": 22, "vertices": [{ "x": 285, "y": 493 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "dea91981-81fd-4783-9160-03031ba8d49c" }, "target": { "id": "80fcf7ab-ddb8-49f9-8352-521d3b9d27bb" }, "id": "29f25811-fc77-4c11-90ee-757642245935", "z": 23, "vertices": [{ "x": 272.5, "y": 603 }], "labels": [{ "attrs": { "text": { "text": "NO" } }, "position": 30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "80fcf7ab-ddb8-49f9-8352-521d3b9d27bb" }, "target": { "id": "e8d0fb94-a6b4-4750-8aa6-ec80954544c7" }, "id": "809f432f-532d-479f-af0e-aae9f0fc0d40", "z": 24, "vertices": [{ "x": 465, "y": 603 }, { "x": 465, "y": 548 }, { "x": 465, "y": 493 }, { "x": 465, "y": 441 }, { "x": 465, "y": 389 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "dea91981-81fd-4783-9160-03031ba8d49c" }, "target": { "id": "682e6269-d0f5-4206-9b41-d80850c40f1f" }, "id": "022dfafa-fdd4-4d20-9032-7dfeb6baca0a", "z": 25, "labels": [{ "attrs": { "text": { "text": "YES" } }, "position": -30 }], "vertices": [{ "x": 432.5, "y": 603 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "682e6269-d0f5-4206-9b41-d80850c40f1f" }, "target": { "id": "5bf0c793-f5b1-4007-a4ff-d05237d47dd8" }, "id": "c8608522-bf4d-4ac8-baf5-dbb0d4dc045c", "z": 26, "vertices": [{ "x": 445, "y": 707 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "5bf0c793-f5b1-4007-a4ff-d05237d47dd8" }, "target": { "id": "f5de14b5-57a6-4b24-bca7-300b86efb829" }, "id": "e12f6940-2d51-404f-8774-68dfd65486d5", "z": 27, "labels": [{ "attrs": { "text": { "text": "NO" } }, "position": -30 }], "vertices": [{ "x": 432.5, "y": 817 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "f5de14b5-57a6-4b24-bca7-300b86efb829" }, "target": { "id": "d1cbc24f-34e9-49e3-b486-1b95075b34d0" }, "id": "2b877535-00a6-494a-b7d8-e082cd08b5cd", "z": 28, "labels": [{ "attrs": { "text": { "text": "NO" } }, "position": 30 }], "vertices": [{ "x": 375, "y": 927 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "d1cbc24f-34e9-49e3-b486-1b95075b34d0" }, "target": { "id": "a5eb0f0b-9e26-49af-b3de-0adb2ae72676" }, "id": "016a36ba-9f0b-49d6-afa5-5084780b5fcf", "z": 29, "vertices": [{ "x": 375, "y": 1027 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "a5eb0f0b-9e26-49af-b3de-0adb2ae72676" }, "target": { "id": "e65b5857-632d-4727-a6d2-c22474916bb4" }, "id": "5299a197-7585-4576-80b2-052c3735c443", "z": 30, "labels": [{ "attrs": { "text": { "text": "YES" } }, "position": -30 }], "vertices": [{ "x": 335, "y": 1137 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "e65b5857-632d-4727-a6d2-c22474916bb4" }, "target": { "id": "e4b1f19c-a03f-4cd3-aaab-66faa8a8e2a5" }, "id": "20b2f099-726c-454e-9a08-b62f1c0a074d", "z": 31, "vertices": [{ "x": 335, "y": 1241 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "a5eb0f0b-9e26-49af-b3de-0adb2ae72676" }, "target": { "id": "e4b1f19c-a03f-4cd3-aaab-66faa8a8e2a5" }, "id": "2f66e0e9-6fcc-4a04-8dba-92e3a638946d", "z": 32, "vertices": [{ "x": 415, "y": 1137 }, { "x": 415, "y": 1189 }, { "x": 415, "y": 1241 }], "labels": [{ "attrs": { "text": { "text": "NO" } }, "position": 30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "5bf0c793-f5b1-4007-a4ff-d05237d47dd8" }, "target": { "id": "e4b1f19c-a03f-4cd3-aaab-66faa8a8e2a5" }, "id": "34b7fc72-de45-4538-90fe-cfbd43c877ca", "z": 33, "vertices": [{ "x": 592.5, "y": 817 }, { "x": 592.5, "y": 872 }, { "x": 592.5, "y": 927 }, { "x": 592.5, "y": 977 }, { "x": 592.5, "y": 1027 }, { "x": 592.5, "y": 1082 }, { "x": 592.5, "y": 1137 }, { "x": 592.5, "y": 1189 }, { "x": 592.5, "y": 1241 }], "labels": [{ "attrs": { "text": { "text": "YES" } }, "position": 30 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "5fe28ea1-aafb-4001-a8a4-339f0a0129e6" }, "target": { "id": "e4b1f19c-a03f-4cd3-aaab-66faa8a8e2a5" }, "id": "ad5334e0-465a-407d-a92d-136cf0f14ec8", "z": 34, "vertices": [{ "x": 512.5, "y": 1241 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "f5de14b5-57a6-4b24-bca7-300b86efb829" }, "target": { "id": "5fe28ea1-aafb-4001-a8a4-339f0a0129e6" }, "id": "42eb0f71-f733-4a63-acdc-34028c66c65c", "z": 35, "vertices": [{ "x": 512.5, "y": 927 }, { "x": 512.5, "y": 977 }, { "x": 512.5, "y": 1027 }, { "x": 512.5, "y": 1082 }, { "x": 512.5, "y": 1137 }], "labels": [{ "attrs": { "text": { "text": "YES" } }, "position": 30 }], "attrs": {} }]
        }

        const jsonString2: any = {
            "cells": [
                {
                    "type": "app.RectangularModel",
                    "ports": {
                        "groups": {
                            "in": {
                                "markup": "<circle class=\"port-body\" r=\"10\"/>",
                                "attrs": {
                                    ".port-body": {
                                        "fill": "#61549C",
                                        "strokeWidth": 0,
                                        "stroke": "#000",
                                        "r": 10,
                                        "magnet": true
                                    },
                                    ".port-label": {
                                        "fontSize": 11,
                                        "fill": "#61549C",
                                        "fontWeight": 800
                                    }
                                },
                                "label": {
                                    "position": {
                                        "name": "left",
                                        "args": {
                                            "y": 0
                                        }
                                    }
                                },
                                "position": {
                                    "name": "left"
                                }
                            },
                            "out": {
                                "markup": "<circle class=\"port-body\" r=\"10\"/>",
                                "attrs": {
                                    ".port-body": {
                                        "fill": "#61549C",
                                        "strokeWidth": 0,
                                        "stroke": "#000",
                                        "r": 10,
                                        "magnet": true
                                    },
                                    ".port-label": {
                                        "fontSize": 11,
                                        "fill": "#61549C",
                                        "fontWeight": 800
                                    }
                                },
                                "label": {
                                    "position": {
                                        "name": "right",
                                        "args": {
                                            "y": 0
                                        }
                                    }
                                },
                                "position": {
                                    "name": "right"
                                }
                            }
                        },
                        "items": [
                            {
                                "id": "in1",
                                "group": "in",
                                "attrs": {
                                    ".port-label": {
                                        "text": "in1"
                                    }
                                }
                            },
                            {
                                "id": "out1",
                                "group": "out",
                                "attrs": {
                                    ".port-label": {
                                        "text": "out1"
                                    }
                                }
                            }
                        ]
                    },
                    "inPorts": [
                        "in1"
                    ],
                    "outPorts": [
                        "out1"
                    ],
                    "size": {
                        "width": 90,
                        "height": 60
                    },
                    "position": {
                        "x": 380,
                        "y": 270
                    },
                    "angle": 0,
                    "allowOrthogonalResize": false,
                    "id": "df79d595-360a-40f0-b86c-4d12c656747e",
                    "z": 2,
                    "attrs": {
                        ".": {
                            "data-tooltip-position": "left",
                            "data-tooltip-position-selector": ".joint-stencil"
                        },
                        ".label": {
                            "text": "2",
                            "ref-y": 0.5,
                            "font-size": 20,
                            "font-family": "Roboto Condensed",
                            "font-weight": "Normal",
                            "stroke-width": 0,
                            "y-alignment": "middle",
                            "fill": "#222138"
                        },
                        ".body": {
                            "stroke": "#ffd600",
                            "fill": "transparent",
                            "rx": 2,
                            "ry": 2,
                            "stroke-width": 2,
                            "stroke-dasharray": "0"
                        }
                    }
                },
                {
                    "type": "app.RectangularModel",
                    "ports": {
                        "groups": {
                            "in": {
                                "markup": "<circle class=\"port-body\" r=\"10\"/>",
                                "attrs": {
                                    ".port-body": {
                                        "fill": "#61549C",
                                        "strokeWidth": 0,
                                        "stroke": "#000",
                                        "r": 10,
                                        "magnet": true
                                    },
                                    ".port-label": {
                                        "fontSize": 11,
                                        "fill": "#61549C",
                                        "fontWeight": 800
                                    }
                                },
                                "label": {
                                    "position": {
                                        "name": "left",
                                        "args": {
                                            "y": 0
                                        }
                                    }
                                },
                                "position": {
                                    "name": "left"
                                }
                            },
                            "out": {
                                "markup": "<circle class=\"port-body\" r=\"10\"/>",
                                "attrs": {
                                    ".port-body": {
                                        "fill": "#61549C",
                                        "strokeWidth": 0,
                                        "stroke": "#000",
                                        "r": 10,
                                        "magnet": true
                                    },
                                    ".port-label": {
                                        "fontSize": 11,
                                        "fill": "#61549C",
                                        "fontWeight": 800
                                    }
                                },
                                "label": {
                                    "position": {
                                        "name": "right",
                                        "args": {
                                            "y": 0
                                        }
                                    }
                                },
                                "position": {
                                    "name": "right"
                                }
                            }
                        },
                        "items": [
                            {
                                "id": "in1",
                                "group": "in",
                                "attrs": {
                                    ".port-label": {
                                        "text": "in1"
                                    }
                                }
                            },
                            {
                                "id": "out1",
                                "group": "out",
                                "attrs": {
                                    ".port-label": {
                                        "text": "out1"
                                    }
                                }
                            }
                        ]
                    },
                    "inPorts": [
                        "in1"
                    ],
                    "outPorts": [
                        "out1"
                    ],
                    "size": {
                        "width": 90,
                        "height": 60
                    },
                    "position": {
                        "x": 380,
                        "y": 470
                    },
                    "angle": 0,
                    "allowOrthogonalResize": false,
                    "id": "944987ef-4375-4f44-aae1-d13e716372e8",
                    "z": 3,
                    "attrs": {
                        ".": {
                            "data-tooltip-position": "left",
                            "data-tooltip-position-selector": ".joint-stencil"
                        },
                        ".label": {
                            "text": "2",
                            "ref-y": 0.5,
                            "font-size": 20,
                            "font-family": "Roboto Condensed",
                            "font-weight": "Normal",
                            "stroke-width": 0,
                            "y-alignment": "middle",
                            "fill": "#222138"
                        },
                        ".body": {
                            "stroke": "#ffd600",
                            "fill": "transparent",
                            "rx": 2,
                            "ry": 2,
                            "stroke-width": 2,
                            "stroke-dasharray": "0"
                        }
                    }
                },
                {
                    "type": "app.RectangularModel",
                    "ports": {
                        "groups": {
                            "in": {
                                "markup": "<circle class=\"port-body\" r=\"10\"/>",
                                "attrs": {
                                    ".port-body": {
                                        "fill": "#61549C",
                                        "strokeWidth": 0,
                                        "stroke": "#000",
                                        "r": 10,
                                        "magnet": true
                                    },
                                    ".port-label": {
                                        "fontSize": 11,
                                        "fill": "#61549C",
                                        "fontWeight": 800
                                    }
                                },
                                "label": {
                                    "position": {
                                        "name": "left",
                                        "args": {
                                            "y": 0
                                        }
                                    }
                                },
                                "position": {
                                    "name": "left"
                                }
                            },
                            "out": {
                                "markup": "<circle class=\"port-body\" r=\"10\"/>",
                                "attrs": {
                                    ".port-body": {
                                        "fill": "#61549C",
                                        "strokeWidth": 0,
                                        "stroke": "#000",
                                        "r": 10,
                                        "magnet": true
                                    },
                                    ".port-label": {
                                        "fontSize": 11,
                                        "fill": "#61549C",
                                        "fontWeight": 800
                                    }
                                },
                                "label": {
                                    "position": {
                                        "name": "right",
                                        "args": {
                                            "y": 0
                                        }
                                    }
                                },
                                "position": {
                                    "name": "right"
                                }
                            }
                        },
                        "items": [
                            {
                                "id": "in1",
                                "group": "in",
                                "attrs": {
                                    ".port-label": {
                                        "text": "in1"
                                    }
                                }
                            },
                            {
                                "id": "in2",
                                "group": "in",
                                "attrs": {
                                    ".port-label": {
                                        "text": "in2"
                                    }
                                }
                            },
                            {
                                "id": "out1",
                                "group": "out",
                                "attrs": {
                                    ".port-label": {
                                        "text": "out1"
                                    }
                                }
                            }
                        ]
                    },
                    "inPorts": [
                        "in1",
                        "in2"
                    ],
                    "outPorts": [
                        "out1"
                    ],
                    "size": {
                        "width": 90,
                        "height": 60
                    },
                    "position": {
                        "x": 380,
                        "y": 370
                    },
                    "angle": 0,
                    "allowOrthogonalResize": false,
                    "id": "f42d62ad-26e9-4268-bcde-1e8fffd042ac",
                    "z": 4,
                    "attrs": {
                        ".": {
                            "data-tooltip-position": "left",
                            "data-tooltip-position-selector": ".joint-stencil"
                        },
                        ".label": {
                            "text": "3",
                            "ref-y": 0.5,
                            "font-size": 20,
                            "font-family": "Roboto Condensed",
                            "font-weight": "Normal",
                            "stroke-width": 0,
                            "y-alignment": "middle",
                            "fill": "#222138"
                        },
                        ".body": {
                            "stroke": "#ffd600",
                            "fill": "transparent",
                            "rx": 2,
                            "ry": 2,
                            "stroke-width": 2,
                            "stroke-dasharray": "0"
                        }
                    }
                },
                {
                    "type": "fsa.StartState",
                    "size": {
                        "width": 60,
                        "height": 60
                    },
                    "position": {
                        "x": 69,
                        "y": 370
                    },
                    "angle": 0,
                    "preserveAspectRatio": true,
                    "id": "1b80eccf-7ec3-4082-b8f5-521a9cc65440",
                    "z": 5,
                    "attrs": {
                        "circle": {
                            "fill": "#ffd600",
                            "width": 50,
                            "height": 30,
                            "stroke-width": 0
                        },
                        ".": {
                            "data-tooltip-position": "left",
                            "data-tooltip-position-selector": ".joint-stencil"
                        },
                        "text": {
                            "text": "startState",
                            "fill": "#000",
                            "font-family": "Roboto Condensed",
                            "font-weight": "Normal",
                            "font-size": 20,
                            "stroke-width": 0
                        }
                    }
                },
                {
                    "type": "basic.Rect",
                    "position": {
                        "x": 214.9999999999978,
                        "y": 170.00000000000006
                    },
                    "size": {
                        "width": 20,
                        "height": 459.9999999999999
                    },
                    "angle": 0,
                    "id": "92adcaa2-57c1-446a-8195-6bed7bdbe534",
                    "z": 6,
                    "attrs": {
                        "rect": {
                            "fill": "transparent",
                            "stroke": "#ffd600",
                            "width": 50,
                            "height": 30,
                            "rx": 2,
                            "ry": 2,
                            "stroke-width": 2,
                            "stroke-dasharray": "0"
                        },
                        "text": {
                            "fill": "#000",
                            "font-size": 20,
                            "font-family": "Roboto Condensed",
                            "font-weight": "Normal",
                            "stroke-width": 0
                        },
                        ".": {
                            "data-tooltip-position": "left",
                            "data-tooltip-position-selector": ".joint-stencil"
                        }
                    }
                },
                {
                    "type": "basic.Rect",
                    "position": {
                        "x": 590.9999999999931,
                        "y": 170.00000000000003
                    },
                    "size": {
                        "width": 20,
                        "height": 459.99999999999994
                    },
                    "angle": 0,
                    "id": "84dacc01-545b-483d-aca4-9f9c840f0dd5",
                    "z": 8,
                    "attrs": {
                        "rect": {
                            "fill": "transparent",
                            "stroke": "#ffd600",
                            "width": 50,
                            "height": 30,
                            "rx": 2,
                            "ry": 2,
                            "stroke-width": 2,
                            "stroke-dasharray": "0"
                        },
                        "text": {
                            "fill": "#000",
                            "font-size": 20,
                            "font-family": "Roboto Condensed",
                            "font-weight": "Normal",
                            "stroke-width": 0
                        },
                        ".": {
                            "data-tooltip-position": "left",
                            "data-tooltip-position-selector": ".joint-stencil"
                        }
                    }
                },
                {
                    "type": "app.RectangularModel",
                    "ports": {
                        "groups": {
                            "in": {
                                "markup": "<circle class=\"port-body\" r=\"10\"/>",
                                "attrs": {
                                    ".port-body": {
                                        "fill": "#61549C",
                                        "strokeWidth": 0,
                                        "stroke": "#000",
                                        "r": 10,
                                        "magnet": true
                                    },
                                    ".port-label": {
                                        "fontSize": 11,
                                        "fill": "#61549C",
                                        "fontWeight": 800
                                    }
                                },
                                "label": {
                                    "position": {
                                        "name": "left",
                                        "args": {
                                            "y": 0
                                        }
                                    }
                                },
                                "position": {
                                    "name": "left"
                                }
                            },
                            "out": {
                                "markup": "<circle class=\"port-body\" r=\"10\"/>",
                                "attrs": {
                                    ".port-body": {
                                        "fill": "#61549C",
                                        "strokeWidth": 0,
                                        "stroke": "#000",
                                        "r": 10,
                                        "magnet": true
                                    },
                                    ".port-label": {
                                        "fontSize": 11,
                                        "fill": "#61549C",
                                        "fontWeight": 800
                                    }
                                },
                                "label": {
                                    "position": {
                                        "name": "right",
                                        "args": {
                                            "y": 0
                                        }
                                    }
                                },
                                "position": {
                                    "name": "right"
                                }
                            }
                        },
                        "items": [
                            {
                                "id": "in1",
                                "group": "in",
                                "attrs": {
                                    ".port-label": {
                                        "text": "in1"
                                    }
                                }
                            },
                            {
                                "id": "out1",
                                "group": "out",
                                "attrs": {
                                    ".port-label": {
                                        "text": "out1"
                                    }
                                }
                            }
                        ]
                    },
                    "inPorts": [
                        "in1"
                    ],
                    "outPorts": [
                        "out1"
                    ],
                    "size": {
                        "width": 90,
                        "height": 60
                    },
                    "position": {
                        "x": 380,
                        "y": 570
                    },
                    "angle": 0,
                    "allowOrthogonalResize": false,
                    "id": "16cbcee6-93db-41c3-a631-c576c110a86c",
                    "z": 9,
                    "attrs": {
                        ".": {
                            "data-tooltip-position": "left",
                            "data-tooltip-position-selector": ".joint-stencil"
                        },
                        ".label": {
                            "text": "4",
                            "ref-y": 0.5,
                            "font-size": 20,
                            "font-family": "Roboto Condensed",
                            "font-weight": "Normal",
                            "stroke-width": 0,
                            "y-alignment": "middle",
                            "fill": "#222138"
                        },
                        ".body": {
                            "stroke": "#ffd600",
                            "fill": "transparent",
                            "rx": 2,
                            "ry": 2,
                            "stroke-width": 2,
                            "stroke-dasharray": "0"
                        }
                    }
                },
                {
                    "type": "fsa.EndState",
                    "size": {
                        "width": 60,
                        "height": 60
                    },
                    "position": {
                        "x": 695,
                        "y": 370
                    },
                    "angle": 0,
                    "preserveAspectRatio": true,
                    "id": "eb86335b-5937-420c-a83e-e23c2a805920",
                    "z": 10,
                    "attrs": {
                        ".outer": {
                            "fill": "transparent",
                            "stroke": "#ffd600",
                            "stroke-width": 2,
                            "stroke-dasharray": "0"
                        },
                        ".inner": {
                            "fill": "#ffff52",
                            "stroke": "transparent"
                        },
                        ".": {
                            "data-tooltip-position": "left",
                            "data-tooltip-position-selector": ".joint-stencil"
                        },
                        "text": {
                            "text": "endState",
                            "fill": "#000",
                            "font-family": "Roboto Condensed",
                            "font-weight": "Normal",
                            "font-size": 20,
                            "stroke-width": 0
                        }
                    }
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "1b80eccf-7ec3-4082-b8f5-521a9cc65440"
                    },
                    "target": {
                        "id": "92adcaa2-57c1-446a-8195-6bed7bdbe534"
                    },
                    "id": "cf5d06d1-fda0-40dd-8fec-a4c64afd6bb9",
                    "z": 11,
                    "attrs": {}
                },
                {
                    "type": "app.RectangularModel",
                    "ports": {
                        "groups": {
                            "in": {
                                "markup": "<circle class=\"port-body\" r=\"10\"/>",
                                "attrs": {
                                    ".port-body": {
                                        "fill": "#61549C",
                                        "strokeWidth": 0,
                                        "stroke": "#000",
                                        "r": 10,
                                        "magnet": true
                                    },
                                    ".port-label": {
                                        "fontSize": 11,
                                        "fill": "#61549C",
                                        "fontWeight": 800
                                    }
                                },
                                "label": {
                                    "position": {
                                        "name": "left",
                                        "args": {
                                            "y": 0
                                        }
                                    }
                                },
                                "position": {
                                    "name": "left"
                                }
                            },
                            "out": {
                                "markup": "<circle class=\"port-body\" r=\"10\"/>",
                                "attrs": {
                                    ".port-body": {
                                        "fill": "#61549C",
                                        "strokeWidth": 0,
                                        "stroke": "#000",
                                        "r": 10,
                                        "magnet": true
                                    },
                                    ".port-label": {
                                        "fontSize": 11,
                                        "fill": "#61549C",
                                        "fontWeight": 800
                                    }
                                },
                                "label": {
                                    "position": {
                                        "name": "right",
                                        "args": {
                                            "y": 0
                                        }
                                    }
                                },
                                "position": {
                                    "name": "right"
                                }
                            }
                        },
                        "items": [
                            {
                                "id": "in1",
                                "group": "in",
                                "attrs": {
                                    ".port-label": {
                                        "text": "in1"
                                    }
                                }
                            },
                            {
                                "id": "out1",
                                "group": "out",
                                "attrs": {
                                    ".port-label": {
                                        "text": "out1"
                                    }
                                }
                            }
                        ]
                    },
                    "inPorts": [
                        "in1"
                    ],
                    "outPorts": [
                        "out1"
                    ],
                    "size": {
                        "width": 90,
                        "height": 60
                    },
                    "position": {
                        "x": 380,
                        "y": 170.00000000000006
                    },
                    "angle": 0,
                    "allowOrthogonalResize": false,
                    "id": "88504fd4-dfb4-4e7b-a6d6-21266e05faa0",
                    "z": 12,
                    "attrs": {
                        ".": {
                            "data-tooltip-position": "left",
                            "data-tooltip-position-selector": ".joint-stencil"
                        },
                        ".label": {
                            "text": "4",
                            "ref-y": 0.5,
                            "font-size": 20,
                            "fill": "#222138",
                            "font-family": "Roboto Condensed",
                            "font-weight": "Normal",
                            "stroke-width": 0,
                            "y-alignment": "middle"
                        },
                        ".body": {
                            "stroke": "#ffd600",
                            "fill": "transparent",
                            "rx": 2,
                            "ry": 2,
                            "stroke-width": 2,
                            "stroke-dasharray": "0"
                        }
                    }
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "92adcaa2-57c1-446a-8195-6bed7bdbe534"
                    },
                    "target": {
                        "id": "88504fd4-dfb4-4e7b-a6d6-21266e05faa0",
                        "port": "in1",
                        "selector": "g:nth-child(1) > g:nth-child(3) > circle:nth-child(1)"
                    },
                    "id": "bd6a3e65-e9c5-4a6f-9469-1017a46818d2",
                    "z": 13,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "92adcaa2-57c1-446a-8195-6bed7bdbe534"
                    },
                    "target": {
                        "id": "df79d595-360a-40f0-b86c-4d12c656747e",
                        "port": "in1",
                        "selector": "g:nth-child(1) > g:nth-child(3) > circle:nth-child(1)"
                    },
                    "id": "bca80e62-eed3-484f-9f01-54a6c78de304",
                    "z": 14,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "92adcaa2-57c1-446a-8195-6bed7bdbe534"
                    },
                    "target": {
                        "id": "f42d62ad-26e9-4268-bcde-1e8fffd042ac",
                        "port": "in1",
                        "selector": "g:nth-child(1) > g:nth-child(3) > circle:nth-child(1)"
                    },
                    "id": "d434e697-0010-40b5-a194-2b1ca40dec73",
                    "z": 15,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "92adcaa2-57c1-446a-8195-6bed7bdbe534"
                    },
                    "target": {
                        "id": "f42d62ad-26e9-4268-bcde-1e8fffd042ac",
                        "port": "in2",
                        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)"
                    },
                    "id": "5ae7c96a-2e3d-4ad1-a8c2-637e85c38b78",
                    "z": 16,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "92adcaa2-57c1-446a-8195-6bed7bdbe534"
                    },
                    "target": {
                        "id": "944987ef-4375-4f44-aae1-d13e716372e8",
                        "port": "in1",
                        "selector": "g:nth-child(1) > g:nth-child(3) > circle:nth-child(1)"
                    },
                    "id": "ba6409cf-082f-4c5f-a81c-d31ff7f1f76d",
                    "z": 17,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "92adcaa2-57c1-446a-8195-6bed7bdbe534"
                    },
                    "target": {
                        "id": "16cbcee6-93db-41c3-a631-c576c110a86c",
                        "port": "in1",
                        "selector": "g:nth-child(1) > g:nth-child(3) > circle:nth-child(1)"
                    },
                    "id": "c7e9129d-48d0-48d3-a8a3-51811a9f0438",
                    "z": 18,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "88504fd4-dfb4-4e7b-a6d6-21266e05faa0",
                        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
                        "port": "out1"
                    },
                    "target": {
                        "id": "84dacc01-545b-483d-aca4-9f9c840f0dd5"
                    },
                    "id": "2d5c7d34-bbbe-483e-9237-facf649abfb3",
                    "z": 19,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "df79d595-360a-40f0-b86c-4d12c656747e",
                        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
                        "port": "out1"
                    },
                    "target": {
                        "id": "84dacc01-545b-483d-aca4-9f9c840f0dd5"
                    },
                    "id": "5c27f29d-dfc1-45f1-bae2-eff5dc5ede6f",
                    "z": 20,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "f42d62ad-26e9-4268-bcde-1e8fffd042ac",
                        "selector": "g:nth-child(1) > g:nth-child(5) > circle:nth-child(1)",
                        "port": "out1"
                    },
                    "target": {
                        "id": "84dacc01-545b-483d-aca4-9f9c840f0dd5"
                    },
                    "id": "5c5d046f-15f7-47c4-913f-aaf79d3d509d",
                    "z": 21,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "944987ef-4375-4f44-aae1-d13e716372e8",
                        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
                        "port": "out1"
                    },
                    "target": {
                        "id": "84dacc01-545b-483d-aca4-9f9c840f0dd5"
                    },
                    "id": "b907d5e4-0149-4454-a50d-6a23a2043f27",
                    "z": 22,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "16cbcee6-93db-41c3-a631-c576c110a86c",
                        "selector": "g:nth-child(1) > g:nth-child(4) > circle:nth-child(1)",
                        "port": "out1"
                    },
                    "target": {
                        "id": "84dacc01-545b-483d-aca4-9f9c840f0dd5"
                    },
                    "id": "b55e51d0-0c1a-432c-aacf-c66d1559d1d1",
                    "z": 23,
                    "attrs": {}
                },
                {
                    "type": "app.Link",
                    "router": {
                        "name": "normal"
                    },
                    "connector": {
                        "name": "normal"
                    },
                    "source": {
                        "id": "84dacc01-545b-483d-aca4-9f9c840f0dd5"
                    },
                    "target": {
                        "id": "eb86335b-5937-420c-a83e-e23c2a805920"
                    },
                    "id": "b73c0841-9cc6-4d76-b647-28b33cb94e81",
                    "z": 24,
                    "attrs": {}
                }
            ]
        }

        this.graph.fromJSON(jsonString2);
    };

    public validateDiagram() {
        console.log(`validateDiagram`);

        const jsonString = JSON.stringify(this.graph);
        console.log(`jsonString`);
        console.log(jsonString);

        // TODO - logic for validating diagram
    };

    public startDiagram() {
        console.log(`startDiagram`);
        let test: any[] = [];
        let isPaused: boolean = false;
        let time: number = 0;

        if (test.length < 1) {
            test.push(this.graph.getElements()[0]);
            test.push(this.graph.getElements()[3]);
            test.push(this.graph.getElements()[4]);
            test.push(this.graph.getElements()[2]);
            test.push(this.graph.getElements()[1]);
            test.push(this.graph.getElements()[5]);
            test.push(this.graph.getElements()[12]);
            test.push(this.graph.getElements()[6]);
            test.push(this.graph.getElements()[7]);
            test.push(this.graph.getElements()[13]);
            test.push(this.graph.getElements()[14]);

            test.push(this.graph.getElements()[10]);
            test.push(this.graph.getElements()[15]);
            test.push(this.graph.getElements()[11]);
            test.push(this.graph.getElements()[9]);
            test.push(this.graph.getElements()[8]);
        }

        time1 = setInterval(function () {
            // console.log(`index -> ${index}, test.length -> ${test.length}`);
            // console.log(test[index].attributes.type);
            // console.log(test[index].attributes.type.charAt(0));
            let name: string = '';

            if (test[index].attributes.type.charAt(0) === 'f' ||
                test[index].attributes.type.charAt(0) === 'e') {
                name = test[index].attributes.type.substring(4, test[index].attributes.type.length).toLowerCase()
            } else {
                name = test[index].attributes.type.substring(6, test[index].attributes.type.length).toLowerCase()
            }

            if (index != test.length - 1) {
                colorElement(test[index], name);

                setTimeout(function () {
                    removeColorElement(test[index - 1], name);
                }, 700)

                index++;
            }
            if (index == test.length - 1) {
                index = 0;
                clearInterval(time1);
            };
        }, 1000);
    };

    public pauseDiagram() {
        // console.log(`pauseDiagram`);
        clearInterval(time1);
    };

    public stopDiagram() {
        // console.log(`stopDiagram`);
        clearInterval(time1);
        index = 0;
        _.each(this.graph.getElements(), (node, index) => {
            removeColorElement(node, (node.attributes.type.substring(6, node.attributes.type.length)).toLowerCase());
        })
    };
}

function isBorderClicked(bbox: any, x: number, y: number, strokeWidth: number): boolean {
    let borderClicked: boolean = false;

    // checking the place of click on element. 
    const element_click_x: number = (bbox.width + bbox.x) - x;
    const element_click_y: number = (bbox.height + bbox.y) - y;

    if (strokeWidth < 5) {
        strokeWidth = 5;
    }

    if (element_click_x <= strokeWidth ||
        element_click_y <= strokeWidth
    ) {
        borderClicked = true;
    }

    if (bbox.width - 5 <= element_click_x ||
        element_click_x >= bbox.width + 5) {
        borderClicked = true;
    }

    if (bbox.height - 5 <= element_click_y ||
        element_click_y >= bbox.height + 5) {
        borderClicked = true;
    }

    return borderClicked;
}

function colorElement(node: any, name: string) {
    // console.log(`colorElement`);
    // console.log(node.attributes.attrs.text.text);
    console.log(node);
    // console.log(name);

    if (name === 'state') {
        name = 'circle';
        node.attr(`${name}/fill`, {
            type: 'linearGradient',
            stops: [
                { offset: '0%', color: '#E67E22' }
            ]
        });
    } else {
        node.attr(`${name}/fill`, {
            type: 'linearGradient',
            stops: [
                { offset: '0%', color: '#ffff52' }
            ]
        });
    }

    if (node.attributes.attrs.text.text === 'Alarm') {
        node.attr(`${name}/fill`, {
            type: 'linearGradient',
            stops: [
                { offset: '0%', color: '#ED3032' }
            ]
        });
    }
};

function removeColorElement(node: any, name: string) {
    // console.log(`removeColorElement`);
    if (name === 'state') {
        name = 'circle';
        node.attr(`${name}/fill`, {
            type: 'linearGradient',
            stops: [
                { offset: '0%', color: '#61549C' }
            ]
        });
    } else {
        node.attr(`${name}/fill`, {
            type: 'linearGradient',
            stops: [
                { offset: '0%', color: 'transparent' }
            ]
        });
    }
};

function getActions() {
    const request = new XMLHttpRequest();
    request.open("GET", "/assets/JSON/getAction.json", false);
    request.send(null)
    const my_JSON_object = JSON.parse(request.responseText);

    return my_JSON_object;
}

function addPortsToElement(actions, input): void {
    let in_port_temp: string[] = [];
    let out_port_temp: string[] = [];

    const in_port = {
        id: 'temp',
        "markup": "<circle class=\"port-body\" r=\"10\"/>",
        "attrs": {
            ".port-body": {
                "fill": "#61549C",
                "strokeWidth": 0,
                "stroke": "#000",
                "r": 10,
                "magnet": true
            },
            ".port-label": {
                "text": "in",
                "fontSize": 11,
                "fill": "#61549C",
                "fontWeight": 800
            }
        },
        "label": {
            "position": {
                "name": "left",
                "args": {
                    "y": 0
                }
            }
        },
        "position": {
            "name": "left"
        }
    };

    const out_port = {
        id: 'temp',
        "markup": "<circle class=\"port-body\" r=\"10\"/>",
        "attrs": {
            ".port-body": {
                "fill": "#61549C",
                "strokeWidth": 0,
                "stroke": "#000",
                "r": 10,
                "magnet": true
            },
            ".port-label": {
                "text": "out",
                "fontSize": 11,
                "fill": "#61549C",
                "fontWeight": 800
            }
        },
        "label": {
            "position": {
                "name": "right",
                "args": {
                    "y": 0
                }
            }
        },
        "position": {
            "name": "right"
        }
    };

    for (let i: number = 0; i < actions.Operations.length; i++) {
        if (actions.Operations[i].OperationId === input.attributes.attrs['.label'].text) {
            in_port_temp = actions.Operations[i].inPorts;
            out_port_temp = actions.Operations[i].outPorts;
        }
    }
    if (in_port_temp !== undefined) {
        let port: any[] = [];
        let new_id: any = [];
        let in_port_name: string[] = [];
        for (let i: number = 0; i < in_port_temp.length; i++) {
            new_id.push({
                'id': in_port_temp[i] + '_' + Date.now()
            })
        }
        let in_port_arr = [];
        for (let i: number = 0; i < new_id.length; i++) {
            in_port_arr.push(in_port)
        }
        let in_port_arr_new_id = [];
        for (let i = 0; i < in_port_arr.length; i++) {
            in_port_arr_new_id.push({ ...in_port_arr[i], ...new_id[i] });
        }
        for (let i = 0; i < in_port_arr_new_id.length; i++) {
            in_port_name.push(in_port_arr_new_id[i].attrs['.port-label'].text + (i + 1))
        }
        input.addInPort(in_port_name);
    }
    if (out_port_temp !== undefined) {
        let port: any[] = [];
        let new_id: any = [];
        let out_port_name: string[] = [];
        for (let i: number = 0; i < out_port_temp.length; i++) {
            new_id.push({
                'id': out_port_temp[i] + '_' + Date.now()
            })
        }
        let out_port_arr = [];
        for (let i: number = 0; i < new_id.length; i++) {
            out_port_arr.push(out_port)
        }
        let out_port_arr_new_id = [];
        for (let i = 0; i < out_port_arr.length; i++) {
            out_port_arr_new_id.push({ ...out_port_arr[i], ...new_id[i] });
        }
        for (let i = 0; i < out_port_arr_new_id.length; i++) {
            out_port_name.push(out_port_arr_new_id[i].attrs['.port-label'].text + (i + 1))
        }
        input.addOutPort(out_port_name);
    }
}

function removePortsFromElement(input): void {
    const allPorts: any = input.getPorts();
    const allPorts_len: number = allPorts.length;

    for (let i: number = 0; i < allPorts_len; i++) {
        if (allPorts[i].group === 'in') {
            input.removeInPort(allPorts[i].attrs['.port-label'].text);
        } else {
            input.removeOutPort(allPorts[i].attrs['.port-label'].text);
        }
    }
}

function combineJson(jsonObj, actions) {
    const result = [];
    const actions_len: number = actions.Operations.length;
    const jsonObj_length: number = jsonObj.attributes.cells.models.length;

    for (let i: number = 0; i < jsonObj_length; i++) {
        for (let j: number = 0; j < actions_len; j++) {
            if (jsonObj.attributes.cells.models[i].attributes.attrs['.label'].text == actions.Operations[j].OperationId) {
                result.push({...jsonObj.attributes.cells.models[i], ...actions.Operations[j]})
            }
        }
    }
    return result;
}
