import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as _ from 'lodash';
import * as Backbone from 'backbone';
import * as joint from 'jointjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'JointJS';

    graph: any;
    paper: any;
    stencil: any;

    ngOnInit() {
        this.createGraph();
    }

    private createGraph() {

        // Canvas where shapes are dropped
        var graph = new joint.dia.Graph,
            paper = new joint.dia.Paper({
                el: $('#paper'),
                model: graph
            });

        // Canvas from which you take shapes
        var stencilGraph = new joint.dia.Graph,
            stencilPaper = new joint.dia.Paper({
                el: $('#stencil'),
                height: 60,
                model: stencilGraph,
                interactive: false
            });

        var r1 = new joint.shapes.basic.Rect({
            position: {
                x: 10,
                y: 10
            },
            size: {
                width: 100,
                height: 40
            },
            attrs: {
                text: {
                    text: 'Rect1'
                }
            }
        });
        var r2 = new joint.shapes.basic.Rect({
            position: {
                x: 120,
                y: 10
            },
            size: {
                width: 100,
                height: 40
            },
            attrs: {
                text: {
                    text: 'Rect2'
                }
            }
        });
        stencilGraph.addCells([r1, r2]);

        stencilPaper.on('cell:pointerdown', function (cellView, e, x, y) {
            $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>');
            var flyGraph = new joint.dia.Graph,
                flyPaper = new joint.dia.Paper({
                    el: $('#flyPaper'),
                    model: flyGraph,
                    interactive: false
                }),
                flyShape = cellView.model.clone(),
                pos = cellView.model.position(),
                offset = {
                    x: x - pos.x,
                    y: y - pos.y
                };

            flyShape.position(0, 0);
            flyGraph.addCell(flyShape);
            $("#flyPaper").offset({
                left: e.pageX - offset.x,
                top: e.pageY - offset.y
            });
            $('body').on('mousemove.fly', function (e) {
                $("#flyPaper").offset({
                    left: e.pageX - offset.x,
                    top: e.pageY - offset.y
                });
            });
            $('body').on('mouseup.fly', function (e) {
                var x = e.pageX,
                    y = e.pageY,
                    target = paper.$el.offset();

                // Dropped over paper ?
                if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
                    var s = flyShape.clone();
                    s.position(x - target.left - offset.x, y - target.top - offset.y);
                    graph.addCell(s);
                }
                $('body').off('mousemove.fly').off('mouseup.fly');
                flyShape.remove();
                $('#flyPaper').remove();
            });
        });



        // this.graph = new joint.dia.Graph();

        // this.stencil = new joint.dia.Paper({
        //     el: $('#stencil'),
        //     height: 60,
        //     model: this.graph,
        //     interactive: false
        // });
        // this.paper = new joint.dia.Paper({
        //     el: $('#paper'),
        //     width: 500,
        //     height: 500,
        //     model: this.graph
        // });

        // // const rect = new joint.shapes.basic.Rect({
        // //     position: { x: 100, y: 100 },
        // //     size: { width: 90, height: 30 },
        // //     attrs: { text: { text: 'Rect1' } }
        // // });

        // // const rect2 = new joint.shapes.basic.Rect({
        // //     position: { x: 250, y: 300 },
        // //     size: { width: 90, height: 30 },
        // //     attrs: { text: { text: 'Rect2' } }
        // // });

        // // const link = new joint.dia.Link({
        // //     source: { id: rect.id },
        // //     target: { id: rect2.id }
        // // });

        // var r1 = new joint.shapes.basic.Rect({
        //     position: {
        //         x: 10,
        //         y: 10
        //     },
        //     size: {
        //         width: 100,
        //         height: 40
        //     },
        //     attrs: {
        //         text: {
        //             text: 'Rect1'
        //         }
        //     }
        // });
        // var r2 = new joint.shapes.basic.Rect({
        //     position: {
        //         x: 120,
        //         y: 10
        //     },
        //     size: {
        //         width: 100,
        //         height: 40
        //     },
        //     attrs: {
        //         text: {
        //             text: 'Rect2'
        //         }
        //     }
        // });

        // // const m1 = new joint.shapes.devs.Model({
        // //     position: { x: 50, y: 50 },
        // //     size: { width: 90, height: 90 },
        // //     inPorts: ['in1', 'in2'],
        // //     outPorts: ['out'],
        // //     ports: {
        // //         groups: {
        // //             'in': {
        // //                 attrs: {
        // //                     '.port-body': {
        // //                         fill: '#16A085'
        // //                     }
        // //                 }
        // //             },
        // //             'out': {
        // //                 attrs: {
        // //                     '.port-body': {
        // //                         fill: '#E74C3C'
        // //                     }
        // //                 }
        // //             }
        // //         }
        // //     },
        // //     attrs: {
        // //         '.label': { text: 'Model', 'ref-x': .5, 'ref-y': .2 },
        // //         rect: { fill: '#2ECC71' }
        // //     }
        // // });

        // this.graph.addCells([r1, r2]);

        // this.stencil.on('cell:pointerdown', function (cellView, e, x, y) {
        //     $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>');
        //     var flyGraph = new joint.dia.Graph,
        //         flyPaper = new joint.dia.Paper({
        //             el: $('#flyPaper'),
        //             model: flyGraph,
        //             interactive: false
        //         }),
        //         flyShape = cellView.model.clone(),
        //         pos = cellView.model.position(),
        //         offset = {
        //             x: x - pos.x,
        //             y: y - pos.y
        //         };

        //     flyShape.position(0, 0);
        //     flyGraph.addCell(flyShape);
        //     $("#flyPaper").offset({
        //         left: e.pageX - offset.x,
        //         top: e.pageY - offset.y
        //     });
        //     $('body').on('mousemove.fly', function (e) {
        //         $("#flyPaper").offset({
        //             left: e.pageX - offset.x,
        //             top: e.pageY - offset.y
        //         });
        //     });
        //     $('body').on('mouseup.fly', function (e) {
        //         var x = e.pageX,
        //             y = e.pageY,
        //             target = paper.$el.offset();

        //         // Dropped over paper ?
        //         if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
        //             var s = flyShape.clone();
        //             s.position(x - target.left - offset.x, y - target.top - offset.y);
        //             graph.addCell(s);
        //         }
        //         $('body').off('mousemove.fly').off('mouseup.fly');
        //         flyShape.remove();
        //         $('#flyPaper').remove();
        //     });
        // });
    }
}
