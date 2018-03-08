import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as config from './config/configuration';
import * as _ from 'lodash';
import * as Backbone from 'backbone';

import '../models/joint.shapes.app';
import * as joint from '../assets/build/rappid.min';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'JointJS';

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

        const jsonString = { "cells": [{ "type": "basic.Circle", "size": { "width": 90, "height": 54 }, "position": { "x": 110, "y": 100 }, "angle": 0, "id": "0bbd0dc7-bac8-4327-8f34-4fc6ebfbec50", "z": 1, "attrs": { "circle": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "font-size": 16, "text": "Start", "fill": "#222138", "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 110, "y": 204 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "cee7b5ba-cc82-4069-8dac-dac0ec7f8d63", "z": 2, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#222138", "text": "Opened", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "basic.Rect", "position": { "x": 110, "y": 308 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "b3531991-aaa2-43d8-94ad-3adc86f25746", "z": 3, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#222138", "text": "Verified", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "cee7b5ba-cc82-4069-8dac-dac0ec7f8d63" }, "target": { "id": "b3531991-aaa2-43d8-94ad-3adc86f25746" }, "id": "ebafcd9f-1b25-4a16-affc-9183b0a3a40f", "z": 4, "labels": [{ "attrs": { "text": { "text": "Verify" } }, "position": 0.5 }], "vertices": [{ "x": 155, "y": 283 }], "attrs": {} }, { "type": "basic.Rect", "position": { "x": 110, "y": 412 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "a93d25d0-87c1-4742-b901-1106f5c16c78", "z": 5, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#222138", "text": "Playing", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "b3531991-aaa2-43d8-94ad-3adc86f25746" }, "target": { "id": "a93d25d0-87c1-4742-b901-1106f5c16c78" }, "id": "e8e72a8a-8569-4648-8bf5-20e80eadf40a", "z": 6, "labels": [{ "attrs": { "text": { "text": "Play" } }, "position": 0.5 }], "vertices": [{ "x": 155, "y": 387 }], "attrs": {} }, { "type": "basic.Rect", "position": { "x": 140, "y": 516 }, "size": { "width": 90, "height": 54 }, "angle": 0, "id": "4bce2379-8ede-48bc-968e-45c9e95f87b2", "z": 7, "attrs": { "rect": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "rx": 2, "ry": 2, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "fill": "#222138", "text": "Paused", "font-size": 16, "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "a93d25d0-87c1-4742-b901-1106f5c16c78" }, "target": { "id": "4bce2379-8ede-48bc-968e-45c9e95f87b2" }, "id": "66e6b65c-0327-43f1-959e-e1d4c1ac7311", "z": 8, "vertices": [{ "x": 155, "y": 491 }], "labels": [{ "attrs": { "text": { "text": "Pause" } }, "position": 0.5 }], "attrs": {} }, { "type": "basic.Circle", "size": { "width": 90, "height": 54 }, "position": { "x": 100, "y": 620 }, "angle": 0, "id": "396f191a-ce20-452a-8f87-37e4e3fe4bfe", "z": 9, "attrs": { "circle": { "fill": "#f6f6f6", "stroke": "#31d0c6", "width": 50, "height": 30, "stroke-width": 2, "stroke-dasharray": "0" }, "text": { "font-size": 16, "text": "End", "fill": "#222138", "font-family": "Roboto Condensed", "font-weight": "Normal", "stroke-width": 0 }, ".": { "data-tooltip-position": "left", "data-tooltip-position-selector": ".joint-stencil" } } }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "0bbd0dc7-bac8-4327-8f34-4fc6ebfbec50" }, "target": { "id": "cee7b5ba-cc82-4069-8dac-dac0ec7f8d63" }, "id": "cbe0a327-febb-4ab1-86b5-219c15dac6e8", "z": 10, "labels": [{ "attrs": { "text": { "text": "Start" } }, "position": 0.5 }], "vertices": [{ "x": 155, "y": 179 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "a93d25d0-87c1-4742-b901-1106f5c16c78" }, "target": { "id": "396f191a-ce20-452a-8f87-37e4e3fe4bfe" }, "id": "8e6c1a0a-66c4-49ee-96e3-399221ed8a89", "z": 12, "vertices": [{ "x": 105, "y": 491 }, { "x": 105, "y": 543 }, { "x": 105, "y": 595 }], "labels": [{ "attrs": { "text": { "text": "Stop" } }, "position": 0.5 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "4bce2379-8ede-48bc-968e-45c9e95f87b2" }, "target": { "id": "396f191a-ce20-452a-8f87-37e4e3fe4bfe" }, "id": "3966e856-f017-488c-b288-f1ab3453a224", "z": 13, "vertices": [{ "x": 185, "y": 595 }], "labels": [{ "attrs": { "text": { "text": "Stop" } }, "position": 0.5 }], "attrs": {} }, { "type": "app.Link", "router": { "name": "normal" }, "connector": { "name": "normal" }, "source": { "id": "4bce2379-8ede-48bc-968e-45c9e95f87b2" }, "target": { "id": "a93d25d0-87c1-4742-b901-1106f5c16c78" }, "id": "b586b675-8330-413e-9b48-979a1d826e6a", "z": 14, "vertices": [{ "x": 195, "y": 491 }], "labels": [{ "attrs": { "text": { "text": "Play" } }, "position": 0.5 }], "attrs": {} }] }


        graph.on('add', (cell: joint.dia.Cell, collection: any, opt: any) => {
            if (opt.stencil) this.createInspector(cell);
        });

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
        graph.fromJSON(jsonString)
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

        return joint.ui.Inspector.create('.inspector-container', _.extend({ cell }, config.inspector[cell.get('type')]));
    }

    initializeHaloAndInspector() {

        this.paper.on('element:pointerup link:options', (cellView: joint.dia.CellView) => {

            const cell = cellView.model;

            if (!this.selection.collection.contains(cell)) {

                if (cell.isElement()) {

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

                    this.selection.collection.reset([]);
                    this.selection.collection.add(cell, { silent: true });
                }

                this.createInspector(cell);
            }
        });
    }

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

    changeSnapLines(checked: boolean) {

        if (checked) {
            this.snaplines.startListening();
            this.stencil.options.snaplines = this.snaplines;
        } else {
            this.snaplines.stopListening();
            this.stencil.options.snaplines = null;
        }
    }

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
        const jsonString = JSON.stringify(this.graph);
        console.log(jsonString);
    }
}
