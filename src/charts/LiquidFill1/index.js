import * as echarts from "echarts";
import 'echarts-liquidfill'
import React, { useState, useEffect, useCallback, useRef } from "react";

export default function (props) {
    const chart = useRef();
    const [node, setNode] = useState();
    var colors = [ '#91cc75', '#fac858', '#ee6666', "#73c0de"];
    const _option = {
        //  backgroundColor: '#0e1c47',
        grid: {
            top: '10%',
            left: '5%',
            right: '5%',
            bottom: '15%',
        },
        xAxis: [{
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#fff',
                    fontSize: 14
                }
            },
            offset: 5,
            data: []
        },
        {
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false,
            },
            data: [ 0, 0, 0, 0],
        },
        {
            //name: '单位：件',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false,
            },
            nameGap: '50',
            data: [],
        },
        ],
        yAxis: {
            type: 'value',
            show: false,
            max: 100,
        },
        series: [
            {
                type: 'bar',
                xAxisIndex: 0,
                data: [ 63, 23, 63, 23],
                barWidth: 2,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            return colors[params.dataIndex];
                        }
                    },
                },
                z: 2,
            },
            {
                name: '外框',
                type: 'bar',
                xAxisIndex: 2,
                barGap: '-100%',
                data: [63, 23, 63, 23],
                barWidth: 4,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            return colors[params.dataIndex];
                        },
                        barBorderRadius: 50,
                    },
                },
                z: 0,
            },
            {
                name: '外圆',
                type: 'scatter',
                hoverAnimation: false,
                data: [ 0, 0, 0, 0],
                xAxisIndex: 2,
                symbolSize: 10,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            return colors[params.dataIndex];
                        },
                        opacity: 1,
                    },
                },
                z: 0,
            },
            // {
            //     type: 'liquidFill',
            //     radius: '25%',
            //     center: ['14%', '55%'],
            //     data: [0.4], // data个数代表波浪数
            //     color: ['#5470c6'],
            //     outline: { // 轮廓设置
            //         show: true,
            //         borderDistance: 8, // 边框与球中间间距
            //         itemStyle: {
            //             borderWidth: 5,
            //             borderColor: '#5470c6',
            //             shadowBlur: 10,
            //             shadowColor: '#fff'
            //         }
            //     },
            //     backgroundStyle: {
            //         shadowColor: 'rgba(0, 0, 0, 0)',
            //         opacity: 0,
            //     },

            //     label: {

            //         normal: {
            //             position: ['50%', '40%'],
            //             formatter: '10000',
            //             textStyle: {
            //                 color: colors[0],
            //                 fontSize: 18
            //             },
            //         }
            //     }
            // }, 
            {
                type: 'liquidFill',
                radius: '25%',
                center: ['16%', '25%'],
                data: [0.4], // data个数代表波浪数
                color: ['#91cc75'],
                outline: { // 轮廓设置
                    show: true,
                    borderDistance: 8, // 边框与球中间间距
                    itemStyle: {
                        borderWidth: 5,
                        borderColor: '#91cc75',
                        shadowBlur: 10,
                        shadowColor: '#fff'
                    }
                },
                backgroundStyle: {
                    shadowColor: 'rgba(0, 0, 0, 0)',
                    opacity: 0,
                },

                label: {
                    normal: {
                        position: ['50%', '40%'],
                        formatter: '10000',
                        textStyle: {
                          //  color: colors[1],
                            fontSize: 18
                        },
                    }
                }
            }, {
                type: 'liquidFill',
                radius: '25%',
                center: ['38%', '55%'],
                data: [0.4], // data个数代表波浪数
                color: ['#fac858'],
                outline: { // 轮廓设置
                    show: true,
                    borderDistance: 8, // 边框与球中间间距
                    itemStyle: {
                        borderWidth: 5,
                        borderColor: '#fac858',
                        shadowBlur: 10,
                        shadowColor: '#fff'
                    }
                },
                backgroundStyle: {
                    shadowColor: 'rgba(0, 0, 0, 0)',
                    opacity: 0,
                },

                label: {
                    normal: {
                        position: ['50%', '40%'],
                        formatter: '10000',
                        textStyle: {
                         //   color: colors[2],
                            fontSize: 18
                        },
                    }
                }
            }, {
                type: 'liquidFill',
                radius: '25%',
                center: ['61%', '25%'],
                data: [0.4], // data个数代表波浪数
                color: ['#ee6666'],
                outline: { // 轮廓设置
                    show: true,
                    borderDistance: 8, // 边框与球中间间距
                    itemStyle: {
                        borderWidth: 5,
                        borderColor: '#ee6666',
                        shadowBlur: 10,
                        shadowColor: '#fff'
                    }
                },
                backgroundStyle: {
                    shadowColor: 'rgba(0, 0, 0, 0)',
                    opacity: 0,
                },

                label: {

                    normal: {
                        position: ['50%', '40%'],
                        formatter: '10000',
                        textStyle: {
                           // color: colors[3],
                            fontSize: 18
                        },
                    }
                }
            }, {
                type: 'liquidFill',
                radius: '25%',
                center: ['84%', '55%'],
                data: [0.4], // data个数代表波浪数
                color: ['#73c0de'],
                outline: { // 轮廓设置
                    show: true,
                    borderDistance: 8, // 边框与球中间间距
                    itemStyle: {
                        borderWidth: 5,
                        borderColor: '#73c0de',
                        shadowBlur: 10,
                        shadowColor: '#fff'
                    }
                },
                backgroundStyle: {
                    shadowColor: 'rgba(0, 0, 0, 0)',
                    opacity: 0,
                },

                label: {
                    normal: {
                        position: ['50%', '40%'],
                        formatter: '10000',
                        textStyle: {
                           // color: colors[4],
                            fontSize: 18
                        },
                    }
                }
            }
        ],
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
            const { name, data } = info;
            const option = chart.current.getOption();
            option.xAxis[0].data = name;
            
            data.forEach((element, i) => {
                option.series[3 + i].label.formatter = `${element}` 
                option.series[3 + i].label.color = colors[i]
            });
            chart.current.setOption(option);
        }
    }


}
