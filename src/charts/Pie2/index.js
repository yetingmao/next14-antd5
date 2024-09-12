import * as echarts from "echarts";
import 'echarts-gl';
import React, { useState, useEffect, useCallback, useRef } from "react";

export default function (props) {
    const chart = useRef();
    const [node, setNode] = useState();
    let angle = 0;//角度，用来做简单的动画效果的
    let value = 55.33;
    const _option = {
        color: ["#EAEA26", "#906BF9", "#FE5656", "#01E17E", "#3DD1F9", "#FFAD05"],
        title: {
            text: " 样本回流数据统计",
            top: '2%',
            textStyle: {
                color: '#fff',
                fontSize: 18
            },
        },
        tooltip: {
            trigger: 'item',
          //  formatter: "{b} : {c} ({d}%)",
          //  backgroundColor: 'rgba(1, 13, 19, 0.5)',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
            borderWidth: 0,
            textStyle: {
                color: 'rgba(212, 232, 254, 1)',
                fontSize: 12,
            },
        },
        legend: {
            type: "scroll",
            orient: "vartical",
            // x: "right",
            right: '5%',
            top: '5%',
            // bottom: "0%",
            itemWidth: 16,
            itemHeight: 8,
            itemGap: 16,
            textStyle: {
                color: '#A3E2F4',
                fontSize: 12,
                fontWeight: 0
            },
            data: []
        },
        grid: {
            left: '15%',
            right: '15%',
            bottom: '10%',
            top: '20%',
            containLabel: true,
        },
        polar: {},
        angleAxis: {
            interval: 1,
            type: 'category',
            data: [],
            z: 10,
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#0B4A6B",
                    width: 1,
                    type: "solid"
                },
                symbolSize: [10, 10]
            },
            axisLabel: {
                interval: 0,
                show: true,
                color: "#0B4A6B",
                margin: 8,
                fontSize: 16
            },
        },
        radiusAxis: {
            boundaryGap: true,
            radius: ["70%", "75%"],
            axisLine: {
                show: false,
                lineStyle: {
                    color: "#0B3E5E",
                    width: 1,
                    type: "solid"
                },
                symbolSize: [10, 10]
            },
            axisLabel: {
                formatter: '{value} %',
                show: false,
                padding: [0, 0, 20, 0],
                color: "#0B3E5E",
                fontSize: 16
            },
            splitLine: {
                lineStyle: {
                    color: "#0B3E5E",
                    width: 2,
                    type: "solid"
                }
            }
        },
        calculable: true,
        series: [
            {
                // name: "",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
                            startAngle: (180 + angle) * Math.PI / 180,
                            endAngle: (270 + angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#0CD3DB",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: []
            }, {
                // name: "",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
                            startAngle: (270 + -angle) * Math.PI / 180,
                            endAngle: (40 + -angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#0CD3DB",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                // name: "",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function (params, api) {
                    return {
                        type: 'arc',
                        shape: {
                            cx: api.getWidth() / 2,
                            cy: api.getHeight() / 2,
                            r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
                            startAngle: (90 + -angle) * Math.PI / 180,
                            endAngle: (220 + -angle) * Math.PI / 180
                        },
                        style: {
                            stroke: "#0CD3DB",
                            fill: "transparent",
                            lineWidth: 1.5
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                //  name: "",
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function (params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65;
                    let point = getCirlPoint(x0, y0, r, (90 + -angle))
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: 4
                        },
                        style: {
                            stroke: "#0CD3DB",//粉
                            fill: "#0CD3DB"
                        },
                        silent: true
                    };
                },
                data: [0]
            }, {
                //  name: "",  //绿点
                type: 'custom',
                coordinateSystem: "none",
                renderItem: function (params, api) {
                    let x0 = api.getWidth() / 2;
                    let y0 = api.getHeight() / 2;
                    let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65;
                    let point = getCirlPoint(x0, y0, r, (270 + -angle))
                    return {
                        type: 'circle',
                        shape: {
                            cx: point.x,
                            cy: point.y,
                            r: 4
                        },
                        style: {
                            stroke: "#0CD3DB",      //绿
                            fill: "#0CD3DB"
                        },
                        silent: true
                    };
                },
                data: [0]
            },
            {
                type: 'pie',
                radius: ["5%", "10%"],
                hoverAnimation: false,
                id: 40,
                labelLine: {
                    normal: {
                        show: false,
                        length: 10,
                        length2: 25
                    },
                    emphasis: {
                        show: false
                    }
                },
                data: [{
                    //  name: '',
                    value: 0,
                    itemStyle: {
                        normal: {
                            color: "#0B4A6B"
                        }
                    }
                }]
            }, {
                type: 'pie',
                radius: ["70%", "75%"],
                hoverAnimation: false,
                id: 30,
                labelLine: {
                    normal: {
                        show: false,
                        length: 10,
                        length2: 25
                    },
                    emphasis: {
                        show: false
                    }
                },
                name: "",
                data: [{
                    name: '',
                    value: 0,
                    itemStyle: {
                        normal: {
                            color: "#0B4A6B"
                        }
                    }
                }]
            },
            {
                stack: 'a',
                type: 'pie',
                radius: ['20%', '60%'],
                roseType: 'area',
                zlevel: 10,
                id: 50,
                label: {
                    normal: {
                        show: true,
                       // formatter: "{c}",
                        textStyle: {
                            fontSize: 12,
                        },
                        position: 'outside'
                    },
                    emphasis: {
                        show: true
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        length: 10,
                        length2: 25
                    },
                    emphasis: {
                        show: false
                    }
                },
                data: [

                ]
            },

        ],
    }
    useEffect(() => {
        if (node) {
            chart.current = echarts.init(node);
            chart.current.setOption(_option);
            if (props.data) {
                handle(props.data);
            }
            setInterval(function () {
                //用setInterval做动画感觉有问题
               // draw()
            }, 100);
        }
    }, [node]);

    useEffect(() => {
        if (props.data) {
            handle(props.data);
        }
    }, [props.data]);
    return (
        <div
            ref={(node) => {
                setNode(node);
            }}
            style={{ width: "100%", height: "100%" }}
        ></div>
    );
    function handle(info) {
        if (chart.current) {
            const { name, data, title } = info;
            const option = chart.current.getOption();
            option.title[0].text = title;
            option.legend[0].data = name;
            option.series[option.series.length - 1].data = data;
            chart.current.setOption(option);
        }
    }
    //获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
    function getCirlPoint(x0, y0, r, angle) {
        let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
        let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
        return {
            x: x1,
            y: y1
        }
    }

    function draw() {
        angle = angle + 3;
        const option = chart.current.getOption();
        chart.current.setOption(option, true)
        //window.requestAnimationFrame(draw);
    }

}
