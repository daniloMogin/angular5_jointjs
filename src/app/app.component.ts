import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as config from './config/configuration';
import * as _ from 'lodash';
// import * as __ from 'lodash-uuid';
import * as Backbone from 'backbone';

import * as jsonM from './../assets/JSON/allJSONstrings';

import '../models/joint.shapes.app';
import * as joint from '../assets/build/rappid.min';

interface StateModel {
    Name: string;
    Transitions: [
        {
            Name: string;
            NextStateOnSuccess: string;
            NextStateOnFailure: string;
            Condition: string;
            Trigger: {
                Message: string;
                Timeout: number;
            };
            Operations: [
                {
                    name: string;
                    arguments: [
                        {
                            parameter: string;
                            argument: string;
                            modifier: string[];
                        }
                    ];
                }
            ];
            TransitionScenario: string;
        }
    ];
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Geutebrueck Rappid';
    name: string = '';
    test; // name of the diagram prompt

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
        // console.log(`ngOnInit`);
        // this.name = prompt('Unesi naziv diagrama');
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
        // console.log(`initializePaper`);
        joint.setTheme('modern');
        const graph = (this.graph = new joint.dia.Graph());
        // graph.on('add', (cell: joint.dia.Cell, collection: any, opt: any) => {
        //     console.log(`cell??????????????????`);
        //     console.log(cell);

        //     if (opt.stencil) this.createInspector(cell);
        // });

        this.commandManager = new joint.dia.CommandManager({ graph: graph });

        const paper = (this.paper = new joint.dia.Paper({
            width: 1000,
            height: 1000,
            gridSize: 10,
            drawGrid: true,
            model: graph,
            defaultLink: new joint.shapes.app.Link()
        }));

        paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
        paper.on('cell:mousewheel', this.onMousewheel.bind(this));

        this.snaplines = new joint.ui.Snaplines({ paper: paper });

        const paperScroller = (this.paperScroller = new joint.ui.PaperScroller({
            paper,
            autoResizePaper: true,
            cursor: 'grab'
        }));

        $('.paper-container').append(paperScroller.el);

        paperScroller.render().center();
    }

    // Create and populate stencil.
    initializeStencil() {
        // console.log(`initializeStencil`);
        const stencil = (this.stencil = new joint.ui.Stencil({
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
            dragStartClone: (cell: joint.dia.Cell) =>
                cell.clone().removeAttr('./data-tooltip')
        }));

        $('.stencil-container').append(stencil.el);
        stencil.render().load(config.stencil.shapes);
    }

    // Create keyboard schortcuts
    initializeKeyboardShortcuts() {
        // console.log(`initializeKeyboardShortcuts`);
        this.keyboard = new joint.ui.Keyboard();
        this.keyboard.on({
            'ctrl+c': () => {
                // Copy all selected elements and their associated links.
                this.clipboard.copyElements(
                    this.selection.collection,
                    this.graph
                );
            },

            'ctrl+v': () => {
                const pastedCells = this.clipboard.pasteCells(this.graph, {
                    translate: { dx: 20, dy: 20 },
                    useLocalStorage: true
                });

                const elements = _.filter(pastedCells, cell =>
                    cell.isElement()
                );

                // Make sure pasted elements get selected immediately. This makes the UX better as
                // the user can immediately manipulate the pasted elements.
                this.selection.collection.reset(elements);
            },

            'ctrl+x shift+delete': () => {
                this.clipboard.cutElements(
                    this.selection.collection,
                    this.graph
                );
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
        // console.log(`initializeSelection`);
        this.clipboard = new joint.ui.Clipboard();
        this.selection = new joint.ui.Selection({
            paper: this.paper,
            handles: config.selection.handles
        });

        // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
        // Otherwise, initiate paper pan.
        this.paper.on(
            'blank:pointerdown',
            (evt: JQuery.Event, x: number, y: number) => {
                if (this.keyboard.isActive('shift', evt)) {
                    this.selection.startSelecting(evt);
                } else {
                    this.selection.cancelSelection();
                    this.paperScroller.startPanning(evt);
                }
            }
        );

        this.paper.on(
            'element:pointerdown',
            (elementView: joint.dia.ElementView, evt: JQuery.Event) => {
                // Select an element if CTRL/Meta key is pressed while the element is clicked.
                if (this.keyboard.isActive('ctrl meta', evt)) {
                    this.selection.collection.add(elementView.model);
                }
            }
        );

        this.selection.on(
            'selection-box:pointerdown',
            (elementView: joint.dia.ElementView, evt: JQuery.Event) => {
                // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
                if (this.keyboard.isActive('ctrl meta', evt)) {
                    this.selection.collection.remove(elementView.model);
                }
            }
        );
    }

    createInspector(cell: joint.dia.Cell) {
        // console.log(`createInspector`);
        cell.on('change:attrs', input => {
            const actions = getActions();
            const workflows = getWorkflow();
            if (input.attributes.type === 'app.RectangularModel') {
                if (!input.hasPorts()) {
                    addPortsToElement(actions, input);
                } else {
                    removePortsFromElement(input);
                    addPortsToElement(actions, input);
                }
            }
            if (input.attributes.type === 'erd.WeakEntity') {
                if (!input.hasPorts()) {
                    addPortsToWorkflow(workflows, input);
                } else {
                    removePortsToWorkflow(input);
                    addPortsToWorkflow(workflows, input);
                }
            }
            // console.log(`input.attributes.type`);
            // console.log(input.attributes.type);

            if (input.attributes.type === 'erd.IdentifyingRelationship') {
               const in_port = {
                    id: 'temp1',
                    markup: '<circle class="port-body" r="10"/>',
                    group: 'in',
                    attrs: {
                        '.port-body': {
                            fill: '#61549C',
                            strokeWidth: 0,
                            stroke: '#000',
                            r: 10,
                            magnet: true
                        },
                        '.port-label': {
                            text: 'in',
                            fontSize: 11,
                            fill: '#61549C',
                            fontWeight: 800
                        }
                    },
                    label: {
                        position: {
                            name: 'left',
                            args: {
                                y: 0
                            }
                        }
                    },
                    position: {
                        name: 'left'
                    }
                };

                const out_port = {
                    id: 'temp',
                    markup: '<circle class="port-body" r="10"/>',
                    group: 'out',
                    attrs: {
                        '.port-body': {
                            fill: '#61549C',
                            strokeWidth: 0,
                            stroke: '#000',
                            r: 10,
                            magnet: true
                        },
                        '.port-label': {
                            text: 'out',
                            fontSize: 11,
                            fill: '#61549C',
                            fontWeight: 800
                        }
                    },
                    label: {
                        text: 'fgh',
                        position: {
                            name: 'right',
                            args: {
                                y: 0
                            }
                        }
                    },
                    position: {
                        name: 'bottom'
                    }
                };
                const port = [];
                port.push(out_port);
                port.push(in_port);

                console.log(`port`);
                console.log(port);

                input.addPorts(port);
            }
        });

        return joint.ui.Inspector.create(
            '.inspector-container',
            _.extend({ cell }, config.inspector[cell.get('type')])
        );
    }

    // Click on element create frame with functions for manipulating size, link...
    initializeHaloAndInspector() {
        // console.log(`initializeHaloAndInspector`);
        this.paper.on(
            'element:pointerup link:options',
            (cellView: joint.dia.CellView) => {
                const cell = cellView.model;
                if (!this.selection.collection.contains(cell)) {
                    if (cell.isElement()) {
                        if (
                            cell.attributes.type === 'app.RectangularModel' ||
                            cell.attributes.type === 'erd.WeakEntity' ||
                            cell.attributes.type ===
                                'erd.IdentifyingRelationship'
                        ) {
                            new joint.ui.FreeTransform({
                                cellView,
                                allowRotation: false,
                                preserveAspectRatio: !!cell.get(
                                    'preserveAspectRatio'
                                ),
                                allowOrthogonalResize:
                                    cell.get('allowOrthogonalResize') !== false
                            }).render();

                            new joint.ui.Halo({
                                cellView,
                                handles: config.haloNoLink.handles
                            }).render();
                        } else {
                            new joint.ui.FreeTransform({
                                cellView,
                                allowRotation: false,
                                preserveAspectRatio: !!cell.get(
                                    'preserveAspectRatio'
                                ),
                                allowOrthogonalResize:
                                    cell.get('allowOrthogonalResize') !== false
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
            }
        );
    }

    // Minimap for designer
    initializeNavigator() {
        // console.log(`initializeNavigator`);
        const navigator = (this.navigator = new joint.ui.Navigator({
            width: 240,
            height: 115,
            paperScroller: this.paperScroller,
            zoom: false
        }));

        $('.navigator-container').append(navigator.el);
        navigator.render();
    }

    // Create toolbar with all desired options
    initializeToolbar() {
        // console.log(`initializeToolbar`);
        const toolbar = (this.toolbar = new joint.ui.Toolbar({
            groups: config.toolbar.groups,
            tools: config.toolbar.tools,
            references: {
                paperScroller: this.paperScroller,
                commandManager: this.commandManager
            }
        }));

        toolbar.on({
            'svg:pointerclick': () => this.openAsSVG(),
            'png:pointerclick': () => this.openAsPNG(),
            'to-front:pointerclick': () =>
                this.selection.collection.invoke('toFront'),
            'to-back:pointerclick': () =>
                this.selection.collection.invoke('toBack'),
            'layout:pointerclick': () => this.layoutDirectedGraph(),
            'snapline:change': (checked: boolean) =>
                this.changeSnapLines(checked),
            'clear:pointerclick': () => this.graph.clear(),
            'print:pointerclick': () => this.paper.print(),
            'grid-size:change': (size: number) => this.paper.setGridSize(size)
        });

        $('.toolbar-container').append(toolbar.el);
        toolbar.render();
    }

    // Turn on/off snaping to other elements on drag
    changeSnapLines(checked: boolean) {
        // console.log(`changeSnapLines`);
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
        // console.log(`initializeTooltips`);
        new joint.ui.Tooltip({
            rootTarget: document.body,
            target: '[data-tooltip]',
            direction: joint.ui.Tooltip.TooltipArrowPosition.Auto,
            padding: 10
        });
    }

    openAsSVG() {
        // console.log(`openAsSVG`);
        this.paper.toSVG(
            (svg: string) => {
                new joint.ui.Lightbox({
                    title:
                        '(Right-click, and use "Save As" to save the diagram in SVG format)',
                    image: 'data:image/svg+xml,' + encodeURIComponent(svg)
                }).open();
            },
            { preserveDimensions: true, convertImagesToDataUris: true }
        );
    }

    openAsPNG() {
        // console.log(`openAsPNG`);
        this.paper.toPNG(
            (dataURL: string) => {
                new joint.ui.Lightbox({
                    title:
                        '(Right-click, and use "Save As" to save the diagram in PNG format)',
                    image: dataURL
                }).open();
            },
            { padding: 10 }
        );
    }

    onMousewheel(
        cellView: joint.dia.CellView,
        evt: JQuery.Event,
        ox: number,
        oy: number,
        delta: number
    ) {
        if (this.keyboard.isActive('alt', evt)) {
            evt.preventDefault();
            this.paperScroller.zoom(delta * 0.2, {
                min: 0.2,
                max: 5,
                grid: 0.2,
                ox,
                oy
            });
        }
    }

    // Creating auto layout
    layoutDirectedGraph() {
        // console.log(`layoutDirectedGraph`);
        joint.layout.DirectedGraph.layout(this.graph, {
            setVertices: true,
            rankDir: 'LR',
            marginX: 100,
            marginY: 100
        });
        this.paperScroller.centerContent();
    }

    saveToJSON() {
        // console.log(`saveToJSON`);
        const actions = getActions();
        const workflow = getWorkflow();
        const graphJson = this.graph;
        const usedOperationsInWorkflow: any = getUsedOperations(
            graphJson,
            actions
        );
        const usedWorkflowInWorkflow: any = getUsedWorkflow(
            graphJson,
            workflow
        );
        const name: string = this.name;
        const graphJson_str: any = JSON.stringify(graphJson);
        const graphJson_obj: any = JSON.parse(graphJson_str);

        graphJson_obj['Name'] = name;
        graphJson_obj['Operations'] = usedOperationsInWorkflow;
        graphJson_obj['Workflow'] = usedWorkflowInWorkflow;
        graphJson_obj['States'] = [];
        // console.log(`graphJson_obj`);
        // console.log(graphJson_obj);
        // console.log(JSON.stringify(graphJson_obj));

        const result: any = [];

        _.each(graphJson.getElements(), (element: joint.dia.Element): void => {
            const opt = {
                outbound: true
            };
            const currentElementTextPart = _.find(
                element.attributes.attrs,
                'text'
            ).text;

            if (
                element.attributes.type === 'fsa.StartState' ||
                element.attributes.type === 'erd.IdentifyingRelationship' ||
                element.attributes.type === 'basic.Rect'
            ) {
                // if (
                //     // currentElementTextPart === 'Init'
                //     currentElementTextPart === '1'
                //     // currentElementTextPart === 'WaitOnAlarm'
                //     // currentElementTextPart === '3'
                // ) {
                const allStates = [];
                const finalState = [];
                const connectedElements_temp = getNeighborsRec(
                    graphJson,
                    element,
                    opt,
                    allStates,
                    finalState
                );
                const states = findAllStates(
                    graphJson,
                    element,
                    connectedElements_temp.finalState
                );

                let createdState: any;
                const state: any[] = [];
                for (const i of states) {
                    createdState = createStateFunc(
                        currentElementTextPart,
                        i,
                        'StepByStep',
                        null
                    );
                    state.push(createdState);
                }
                result.push({
                    Name: currentElementTextPart,
                    Transitions: [...state]
                });
                // }
            }
        });
        if (result.length > 0) {
            console.log(`result`);
            console.log(result);
        }
    }

    loadFromJSON() {
        // console.log(`loadFromJSON`);
        // TODO - logic for getting diagram from database
        this.graph.fromJSON(jsonM.jsonString8);
    }

    validateDiagram() {
        console.log(`validateDiagram`);
        // TODO - logic for validating diagram
    }

    startDiagram() {
        console.log(`startDiagram`);
    }

    pauseDiagram() {
        console.log(`pauseDiagram`);
    }

    stopDiagram() {
        console.log(`stopDiagram`);
    }
}

const findAllStates = (
    graphJson: joint.dia.Graph,
    element: joint.dia.Element,
    connectedElementsFinal
) => {
    const allLinks: joint.dia.Link[] = graphJson.getLinks();
    const resultArr: any[] = [];
    for (const i of connectedElementsFinal) {
        const operationArr: any = [];
        const messageArr: any = [];
        const linksArr: any = [];
        const result: any = [];
        resultArr.push(
            findLink(
                graphJson,
                allLinks,
                element,
                i,
                operationArr,
                messageArr,
                linksArr,
                result
            )
        );
    }
    for (const i of resultArr) {
        i.result.firstElement = element;
    }

    return resultArr;
};

const findLink = (
    graphJson: joint.dia.Graph,
    allLinks: joint.dia.Link[],
    firstElement: joint.dia.Element,
    lastElement: joint.dia.Element,
    operationArr,
    messageArr,
    linksArr,
    result
) => {
    let tempFirstElement: any = [];

    for (let i: number = 0; i < allLinks.length; i++) {
        if (allLinks[i].attributes.source.id === firstElement.id) {
            tempFirstElement = graphJson.getCell(
                allLinks[i].attributes.target.id
            );
            linksArr.push(allLinks[i]);
            const index = allLinks.indexOf(allLinks[i]);
            allLinks.splice(index, 1);
            if (tempFirstElement.attributes.type === 'app.RectangularModel') {
                operationArr.push(tempFirstElement);
                findLink(
                    graphJson,
                    allLinks,
                    tempFirstElement,
                    lastElement,
                    operationArr,
                    messageArr,
                    linksArr,
                    result
                );
            }
            if (tempFirstElement.attributes.type === 'erd.ISA') {
                messageArr.push(tempFirstElement);
                findLink(
                    graphJson,
                    allLinks,
                    tempFirstElement,
                    lastElement,
                    operationArr,
                    messageArr,
                    linksArr,
                    result
                );
            }
            break;
        }
    }
    result = {
        firstElement: '',
        lastElement,
        operation: operationArr,
        message: messageArr,
        links: linksArr
    };
    return { result };
};

const createStateFunc = (
    currentElementTextPart,
    stateSlice,
    transitionScenario,
    condition
) => {
    const tempState: any = [];
    const endElementTextPart: string[] = [];
    let messageTextPart: string[] = [];
    const operationTextPart: string[] = [];
    const linksTextPart: string[] = [];
    let message: string;

    endElementTextPart.push(
        _.find(stateSlice.result.lastElement.attributes.attrs, 'text').text
    );
    for (const j of stateSlice.result.message) {
        messageTextPart.push(_.find(j.attributes.attrs, 'text').text);
    }
    for (const k of stateSlice.result.operation) {
        operationTextPart.push(_.find(k.attributes.attrs, 'text').text);
    }
    for (const k of stateSlice.result.links) {
        if (!_.isNil(k.attributes.labels)) {
            for (const m of k.attributes.labels) {
                linksTextPart.push(m.attrs.text.text);
            }
        }
    }
    message = messageTextPart[messageTextPart.length - 1] || null;
    if (linksTextPart.length > 0) {
        messageTextPart = linksTextPart;
    }
    tempState.push({
        Name:
            currentElementTextPart +
            '_' +
            endElementTextPart[endElementTextPart.length - 1] +
            '_' +
            messageTextPart[messageTextPart.length - 1],
        NextStateOnSuccess: endElementTextPart[endElementTextPart.length - 1],
        NextStateOnFailure: endElementTextPart[endElementTextPart.length - 1],
        Condition: condition,
        Trigger: {
            Message: message,
            Timeout: 0
        },
        Operations: operationTextPart,
        TransitionScenario: transitionScenario
    });
    return tempState;
};

const getNeighborsRec = (graph, element, opt, allStates, finalState) => {
    const connectedElements_temp = graph.getNeighbors(element, opt);

    for (const i of connectedElements_temp) {
        if (
            i.attributes.type === 'fsa.StartState' ||
            i.attributes.type === 'erd.IdentifyingRelationship' ||
            i.attributes.type === 'basic.Rect' ||
            i.attributes.type === 'fsa.EndState'
        ) {
            finalState.push(i);
        } else {
            allStates.push(i);
            getNeighborsRec(graph, i, opt, allStates, finalState);
        }
    }

    return { allStates, finalState };
};

const colorElement = (node: any, name: string) => {
    console.log(`colorElement`);
    // console.log(node.attributes.attrs.text.text);
    // console.log(node);
    // console.log(name);

    if (name === 'state') {
        name = 'circle';
        node.attr(`${name}/fill`, {
            type: 'linearGradient',
            stops: [{ offset: '0%', color: '#E67E22' }]
        });
    } else {
        node.attr(`${name}/fill`, {
            type: 'linearGradient',
            stops: [{ offset: '0%', color: '#ffff52' }]
        });
    }

    if (node.attributes.attrs.text.text === 'Alarm') {
        node.attr(`${name}/fill`, {
            type: 'linearGradient',
            stops: [{ offset: '0%', color: '#ED3032' }]
        });
    }
};

const removeColorElement = (node: any, name: string) => {
    console.log(`removeColorElement`);
    if (name === 'state') {
        name = 'circle';
        node.attr(`${name}/fill`, {
            type: 'linearGradient',
            stops: [{ offset: '0%', color: '#61549C' }]
        });
    } else {
        node.attr(`${name}/fill`, {
            type: 'linearGradient',
            stops: [{ offset: '0%', color: 'transparent' }]
        });
    }
};

const getActions = () => {
    // console.log(`getActions`);
    const request = new XMLHttpRequest();
    request.open('GET', '/assets/JSON/getAction.json', false);
    request.send(null);
    const my_JSON_object = JSON.parse(request.responseText);

    return my_JSON_object;
};

const getWorkflow = () => {
    // console.log(`getWorkflow`);
    const request = new XMLHttpRequest();
    request.open('GET', '/assets/JSON/getWorkflowAlter.json', false);
    request.send(null);
    const my_JSON_object = JSON.parse(request.responseText);

    return my_JSON_object;
};

const addPortsToWorkflow = (workflow, input): void => {
    // console.log(`addPortsToWorkflow`);

    const in_port = {
        id: 'temp',
        markup: '<circle class="port-body" r="10"/>',
        group: 'in',
        attrs: {
            '.port-body': {
                fill: '#61549C',
                strokeWidth: 0,
                stroke: '#000',
                r: 10,
                magnet: true
            },
            '.port-label': {
                text: 'in',
                fontSize: 11,
                fill: '#61549C',
                fontWeight: 800
            }
        },
        label: {
            position: {
                name: 'left',
                args: {
                    y: 0
                }
            }
        },
        position: {
            name: 'left'
        }
    };

    const out_port = {
        id: 'temp',
        markup: '<circle class="port-body" r="10"/>',
        group: 'out',
        attrs: {
            '.port-body': {
                fill: '#61549C',
                strokeWidth: 0,
                stroke: '#000',
                r: 10,
                magnet: true
            },
            '.port-label': {
                text: 'out',
                fontSize: 11,
                fill: '#61549C',
                fontWeight: 800
            }
        },
        label: {
            text: 'fgh',
            position: {
                name: 'right',
                args: {
                    y: 0
                }
            }
        },
        position: {
            name: 'right'
        }
    };

    const in_port_temp: any[] = [];
    const out_port_temp: any[] = [];

    let index_in: number = 0;
    let index_out: number = 0;

    const workflowLen: number = workflow.length;

    for (let i: number = 0; i < workflowLen; i++) {
        if (workflow[i].uuid === input.attributes.attrs.text.text) {
            for (const k of workflow[i].cells) {
                if (k.type === 'fsa.StartState') {
                    index_in++;
                    in_port_temp.push({
                        ...in_port,
                        id: 'in' + index_in
                    });
                }
                if (k.type === 'fsa.EndState') {
                    index_out++;
                    out_port_temp.push({
                        ...out_port,
                        id: 'out' + index_out
                    });
                }
            }
        }
    }
    // console.log(`in_port_temp`);
    // console.log(in_port_temp);

    const port = _.flattenDeep([in_port_temp, out_port_temp]);
    // console.log(`port`);
    // console.log(port);
    input.addPorts(port);
};

const removePortsToWorkflow = (input): void => {
    // console.log(`removePortsToWorkflow`);
    const allPorts: any = input.getPorts();
    for (const i of allPorts) {
        input.removePort(i);
    }
};

const addPortsToElement = (actions, input): void => {
    // console.log(`addPortsToElement`);
    let in_port_temp: string[] = [];
    let out_port_temp: string[] = [];

    const in_port = {
        id: 'temp',
        markup: '<circle class="port-body" r="10"/>',
        attrs: {
            '.port-body': {
                fill: '#61549C',
                strokeWidth: 0,
                stroke: '#000',
                r: 10,
                magnet: true
            },
            '.port-label': {
                text: 'in',
                fontSize: 11,
                fill: '#61549C',
                fontWeight: 800
            }
        },
        label: {
            position: {
                name: 'left',
                args: {
                    y: 0
                }
            }
        },
        position: {
            name: 'top'
        }
    };

    const out_port = {
        id: 'temp',
        markup: '<circle class="port-body" r="10"/>',
        attrs: {
            '.port-body': {
                fill: '#61549C',
                strokeWidth: 0,
                stroke: '#000',
                r: 10,
                magnet: true
            },
            '.port-label': {
                text: 'out',
                fontSize: 11,
                fill: '#61549C',
                fontWeight: 800
            }
        },
        label: {
            position: {
                name: 'right',
                args: {
                    y: 0
                }
            }
        },
        position: {
            name: 'bottom'
        }
    };

    for (let i: number = 0; i < actions.Operations.length; i++) {
        if (
            actions.Operations[i].OperationId ===
            input.attributes.attrs['.label'].text
        ) {
            in_port_temp = actions.Operations[i].inPorts;
            out_port_temp = actions.Operations[i].outPorts;
        }
    }
    if (_.isNil(in_port_temp)) {
        const port: any[] = [];
        const new_id: any = [];
        const in_port_name: string[] = [];
        for (let i: number = 0; i < in_port_temp.length; i++) {
            new_id.push({
                id: in_port_temp[i] + '_' + Date.now()
            });
        }
        const in_port_arr = [];
        for (let i: number = 0; i < new_id.length; i++) {
            in_port_arr.push(in_port);
        }
        const in_port_arr_new_id = [];
        for (let i = 0; i < in_port_arr.length; i++) {
            in_port_arr_new_id.push({ ...in_port_arr[i], ...new_id[i] });
        }
        for (let i = 0; i < in_port_arr_new_id.length; i++) {
            in_port_name.push(
                in_port_arr_new_id[i].attrs['.port-label'].text + (i + 1)
            );
        }
        input.addInPort(in_port_name);
    }
    if (_.isNil(out_port_temp)) {
        const port: any[] = [];
        const new_id: any = [];
        const out_port_name: string[] = [];
        for (let i: number = 0; i < out_port_temp.length; i++) {
            new_id.push({
                id: out_port_temp[i] + '_' + Date.now()
            });
        }
        const out_port_arr = [];
        for (let i: number = 0; i < new_id.length; i++) {
            out_port_arr.push(out_port);
        }
        const out_port_arr_new_id = [];
        for (let i = 0; i < out_port_arr.length; i++) {
            out_port_arr_new_id.push({ ...out_port_arr[i], ...new_id[i] });
        }
        for (let i = 0; i < out_port_arr_new_id.length; i++) {
            out_port_name.push(
                out_port_arr_new_id[i].attrs['.port-label'].text + (i + 1)
            );
        }
        input.addOutPort(out_port_name);
    }
};

const removePortsFromElement = (input): void => {
    // console.log(`removePortsFromElement`);
    const allPorts: any = input.getPorts();
    const allPorts_len: number = allPorts.length;

    for (let i: number = 0; i < allPorts_len; i++) {
        if (allPorts[i].group === 'in') {
            input.removeInPort(allPorts[i].attrs['.port-label'].text);
        } else {
            input.removeOutPort(allPorts[i].attrs['.port-label'].text);
        }
    }
};

const getUsedOperations = (jsonObj, actions) => {
    // console.log(`getUsedOperations`);
    const result = [];
    const actions_len: number = actions.Operations.length;
    const jsonObj_length: number = jsonObj.attributes.cells.models.length;

    for (let i: number = 0; i < jsonObj_length; i++) {
        for (let j: number = 0; j < actions_len; j++) {
            if (
                jsonObj.attributes.cells.models[i].attributes.type ===
                'app.RectangularModel'
            ) {
                if (
                    jsonObj.attributes.cells.models[i].attributes.attrs[
                        '.label'
                    ].text === actions.Operations[j].OperationId
                ) {
                    result.push(actions.Operations[j]);
                }
            } else if (
                jsonObj.attributes.cells.models[i].attributes.type ===
                'erd.WeakEntity'
            ) {
                if (
                    jsonObj.attributes.cells.models[i].attributes.attrs.text
                        .text === actions.Operations[j].OperationId
                ) {
                    result.push(actions.Operations[j]);
                }
            }
        }
    }
    return _.uniq(result);
};

const getUsedWorkflow = (jsonObj, workflow) => {
    // console.log(`getUsedWorkflow`);
    const result = [];
    const workflow_len: number = workflow.length;
    const jsonObj_length: number = jsonObj.attributes.cells.models.length;

    for (let i: number = 0; i < jsonObj_length; i++) {
        for (let j: number = 0; j < workflow_len; j++) {
            if (
                jsonObj.attributes.cells.models[i].attributes.type ===
                'erd.WeakEntity'
            ) {
                if (
                    jsonObj.attributes.cells.models[i].attributes.attrs.text
                        .text === workflow[j].uuid
                ) {
                    result.push(workflow[j]);
                }
            }
        }
    }
    return _.uniq(result);
};
