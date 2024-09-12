import * as echarts from "echarts";
import 'echarts-gl';
import React, { useState, useEffect, useCallback, useRef } from "react";

export default function (props) {
    const chart = useRef();
    const [node, setNode] = useState();
  //  var newchartName = ['类型1', '类型1', '类型13', '类型14', '类型15'],
       // newchartValue1 = ['91', '51', '29', 40, 50],
       // newchartValue2 = ['83', '81', '20', 50, 40];
    var barWidth = 40;
    var dataBottom = [
        {
            name: '',
            value: '100',
        },
        {
            name: '',
            value: '100',
        },
        {
            name: '',
            value: '100',
        },
        {
            name: '',
            value: '100',
        },
        {
            name: '',
            value: '100',
        },
    ];
    var color1 = {
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        type: 'linear',
        global: false,
        colorStops: [
            {
                //第一节下面
                offset: 0,
                color: '#1C98CD',
            },
            {
                offset: 1,

                color: 'rgba(61,187,255,.16)',
            },
        ],
    };
    var color2 = {
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        type: 'linear',
        global: false,
        colorStops: [
            {
                //第一节下面
                offset: 0,
                color: '#E7AB47',
            },
            {
                offset: 1,
                color: 'rgba(255,164,41,.16)',
            },
        ],
    };
    const _option = {
        //  backgroundColor: '#0e1c47',
        title: {
            text: "数据对比",
            top: '2%',
            textStyle: {
                color: '#fff',
                fontSize: 18
            },
        },
        legend: {
            data: ['扩充前', '扩充后'],
            icon: 'rect',
            top: 5,
            right: 10,
            textStyle: {
                color: '#fff',
                fontWeight: 'normal',
                fontSize: 12,
            },
        },
        //提示框
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'none',
            },
            formatter: function (param) {
                var resultTooltip =
                    "<div style='background:rgba(13,5,30,.3);border:1px solid rgba(255,255,255,.2);padding:5px 10px;border-radius:4px;'>" +
                    "<div style='text-align:center;'>" +
                    param[0].name +
                    '</div>' +
                    "<div style='padding-top:5px;'>" +
                    "<span style='display:inline-block;border-radius:4px;width:20px;height:10px;background-color:rgba(61,187,255,.3);border: 2px solid #3eb6f5;'></span>" +
                    "<span style=''> " +
                    param[0].seriesName +
                    ': </span>' +
                    "<span style=''>" +
                    param[0].value +
                    '</span>' +
                    '</div>' +
                    "<div style='padding-top:5px;'>" +
                    "<span style='display:inline-block;border-radius:4px;width:20px;height:10px;background-color:rgba(255,164,41,.3);border: 2px solid #ffc241;'></span>" +
                    "<span style=''> " +
                    param[1].seriesName +
                    ': </span>' +
                    "<span style=''>" +
                    param[1].value +
                    '</span>' +
                    '</div>' +
                    '</div>';
                return resultTooltip;
            },
        },
        grid: {
            top: '25%',
            left: '5%',
            bottom: '10%',
            right: '5%',
            containLabel: true,
        },
        animation: false,
        xAxis: [
            {
                type: 'category',
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,.8)',
                    },
                },
                axisLabel: {
                    inside: false,
                    textStyle: {
                        color: '#fff',
                        fontWeight: 'normal',
                        fontSize: 12,
                    },
                    margin: 20, //刻度标签与轴线之间的距离。
                },
                data: [],
            },
        ],
        yAxis: [
            {
                show: true,
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color: '#fff',
                    },
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(255,255,255,.8)',
                    },
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,.8)',
                    },
                },
            },
        ],
        series: [
            {
                name: '扩充前',
                type: 'pictorialBar',
                symbolSize: [barWidth, 10],
                symbolOffset: ['-55%', -5],
                symbolPosition: 'end',
                z: 15,
                color: '#3eb6f5',
                zlevel: 2,
                data: [],
            },
            {
                name: '扩充后',
                type: 'pictorialBar',
                symbolSize: [barWidth, 10],
                symbolOffset: ['55%', -5],
                symbolPosition: 'end',
                z: 15,
                color: '#ffc241',
                zlevel: 2,
                data: [],
            },

            {
                name: '扩充前',
                type: 'bar',
                barGap: '10%',
                barWidth: barWidth,
                itemStyle: {
                    color: color1,
                    borderColor: color1,
                    borderWidth: 1,
                    borderType: 'solid',
                },
                label: {
                    show: true,
                    // formatter: '{c}' + '%',
                    position: 'top',
                    color: 'rgba(119,167,255,1)',
                    fontSize: 12,
                    textAlign: 'center',
                },
                zlevel: 2,
                data: [],
            },
            {
                name: '扩充后',
                type: 'bar',
                barGap: '10%',
                barWidth: barWidth,
                itemStyle: {
                    // color: 'rgba(255,164,41,.16)',
                    color: color2,
                    borderColor: color2,
                    borderWidth: 1,
                    borderType: 'solid',
                },
                label: {
                    show: true,
                    //  formatter: '{c}' + '%',
                    position: 'top',
                    color: 'rgba(255,228,59,1)',
                    fontSize: 12,
                    textAlign: 'center',
                },
                zlevel: 2,
                data: [],
            },
            {
                name: '',
                type: 'pictorialBar',
                symbolSize: [barWidth, 10],
                symbolOffset: ['-55%', 5],
                z: 12,
                color: '#3eb6f5',

                data: dataBottom,
            },
            {
                name: '',
                type: 'pictorialBar',
                symbolSize: [barWidth, 10],
                symbolOffset: ['55%', 5],
                z: 12,
                color: '#ffc241',
                data: dataBottom,
            },
            // 头



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
            const { name, after, bofore } = info;
            const option = chart.current.getOption();
            console.log(option)
            option.xAxis[0].data = name;
            option.series[1].data = bofore
            option.series[3].data = bofore
            option.series[2].data = after
            option.series[3].data = after
            // option.xAxis[1].data = name;
            // data.name.forEach((element, i) => {
            //     option.series[i].data = data.value[i];
            // });
            chart.current.setOption(option);
        }
    }


}
