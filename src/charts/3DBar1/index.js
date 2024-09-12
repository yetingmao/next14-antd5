import * as echarts from "echarts";
import 'echarts-gl';
import React, { useState, useEffect, useCallback, useRef } from "react";

export default function (props) {
    const chart = useRef();
    const [node, setNode] = useState();
    const lineColor = "#224824";
    const _option = {
      //  backgroundColor: '#0e1c47',
        tooltip: {
            show: false,
            backgroundColor: 'rgba(0,0,0,0.9)',
        },
        xAxis3D: {
            name: '',
            data: ["日志抓取总数", "还原图片数量", "调用成功数量", "调用失败数量"],
            axisLine: {
                lineStyle: {
                    color: 'rgba(0,0,0,0)',
                    width: 0
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                interval: 0,
                rotate: 45,
                textStyle: {
                    color: '#fff',
                    fontSize: 12,
                }
            },
            axisTick: {
                show: false
            },

        },
        yAxis3D: {
            name: '',
            type: 'category',
            data: [''],
            axisLine: {
                lineStyle: {
                    color: 'rgba(0,0,0,0)',
                    width: 0
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
        },
        zAxis3D: {
            name: '',
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#0F0',
                    width: 0
                }
            },
            splitLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
        },
        grid3D: {
            boxWidth: 500,
            boxDepth: 20,
            axisPointer: {
                show: false
            },
            light: {
                main: {
                    intensity: 1.2
                },
                ambient: {
                    intensity: 0.3
                }
            },
            viewControl: {
                alpha: 30,
                beta: 0,
                autoRotate: true,
                zoomSensitivity: 0,
                autoRotateAfterStill: 15,
                distance: 250
            }
        },
        series: [{
            type: 'bar3D',
            name: '1',
            barSize: 15,
            itemStyle: {
                normal: {
                    color: function (params) {
                        var colorList = [
                            "#37b70c", "#fae521", "#f29c00", "#dd3f36", "#b3013f", "#a00398", '#E87C25', '#C6E579',
                        ];
                        return colorList[params.dataIndex]
                    },
                }
            },
            data: [

            ],
            stack: 'stack',
            shading: 'lambert',
            label: {
                show: true,
                distance: 1,
                textStyle: {
                    color: '#32CD32',
                    fontSize: 18,
                    borderWidth: 0,
                    borderColor: 'none',
                    backgroundColor: 'rgba(255,255,255,0)',
                    fontFamily: 'impact, Simhei',
                },
            },

        }]
    }
    useEffect(() => {
        if (node) {
            chart.current = echarts.init(node);
            chart.current.setOption(_option);
            if (props.data) {
                handle(props.data);
            }
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
            const { name, value } = info;
            const option = chart.current.getOption();
            option.yAxis3D.data = name;
            const temp = []
            value.forEach((element, i) => {
                temp.push([0, i, element[0]],
                [1, i, element[1]],
                [2, i, element[2]],
                [3, i, element[3]])
            });
            option.series[0].data = temp;
            chart.current.setOption(option);
        }
    }


}
