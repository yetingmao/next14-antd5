import * as echarts from "echarts";
import 'echarts-gl';
import React, { useState, useEffect, useCallback, useRef } from "react";

export default function (props) {
    const chart = useRef();
    const [node, setNode] = useState();
    const lineColor = "#90979c";
    const _option = {
        //  backgroundColor: '#0e1c47',
        title: {
            text: "1234",
            top: '2%',
            textStyle: {
                color: '#fff',
                fontSize: 18
            },
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(1, 13, 19, 0.5)',
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
            show: true,
            right: '5%',
            top: '5%',
            itemWidth: 15,
            itemHeight: 5,
            textStyle: {
                color: '#fff',
            },

            icon: 'path://M0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z',
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '10%',
            top: '20%',
            containLabel: true,
        },
        xAxis: [
            {
                type: "category",
                data: [],
                axisLabel: {
                    fontSize: "12",
                    color: "#fff",
                },
                axisTick: {
                    show: true,
                },
                axisLine: {
                    //坐标轴轴线相关设置。数学上的x轴
                    show: true,
                    lineStyle: {
                        color: lineColor,
                    },
                },
            },
        ],
        yAxis: [
            {
                name: "个",
                nameTextStyle: {
                    color: "rgba(212, 232, 254, 1)",
                    fontSize: 12,
                },
                type: "value",
                splitLine: {
                    lineStyle: {
                        color: lineColor,
                        type: "dashed",
                    },
                }, //设置横线样式
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: lineColor,
                    },
                },
                axisLabel: {
                    fontSize: "12",
                    color: "#fff",
                },
            },
        ],
        series: [
            {
                name: '',
                type: 'bar',
                stack: '排名',
                data: [],
                barWidth: 16,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(42, 193, 216, 1)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(42, 193, 216, 0)',
                        },
                    ]),
                },
            },
            {
                name: '',
                type: 'bar',
                stack: '排名',
                data: [],
                barWidth: 16,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(276, 179, 246, 1)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(276, 79, 246, 0)',
                        },
                    ]),
                },
            },
            // {
            //     name: '',
            //     type: 'bar',
            //     stack: '排名',
            //     data: [],
            //     barWidth: 16,
            //     itemStyle: {
            //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //             {
            //                 offset: 0,
            //                 color: 'rgba(141, 173, 184, 1)',
            //             },
            //             {
            //                 offset: 1,
            //                 color: 'rgba(141, 173, 184, 0)',
            //             },
            //         ]),
            //     },
            // },

            // {
            //     name: '',
            //     type: 'bar',
            //     stack: '排名',
            //     data: [],
            //     barWidth: 16,
            //     itemStyle: {
            //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //             {
            //                 offset: 0,
            //                 color: 'rgba(176, 79, 246, 1)',
            //             },
            //             {
            //                 offset: 1,
            //                 color: 'rgba(176, 79, 246, 0)',
            //             },
            //         ]),
            //     },
            // },
            // {
            //     name: '',
            //     type: 'bar',
            //     stack: '排名',
            //     data: [],
            //     barWidth: 16,
            //     itemStyle: {
            //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            //             {
            //                 offset: 0,
            //                 color: 'rgba(241, 173, 84, 1)',
            //             },
            //             {
            //                 offset: 1,
            //                 color: 'rgba(241, 173, 84, 0)',
            //             },
            //         ]),
            //     },
            // },
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
            const { name, data, title } = info;
            const option = chart.current.getOption();
            option.title[0].text = title;
            option.xAxis[0].data = name;
            data.name.forEach((element, i) => {
                option.series[i].name = element
                option.series[i].data = data.value[i];
            });
            chart.current.setOption(option);
        }
    }


}
