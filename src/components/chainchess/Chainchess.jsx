import React, { useState, useEffect } from "react";
import { Button, Slider, message, InputNumber, Divider, Spin } from "antd";
// import { alo } from "../../alo";
import './Chainchess.css'
const Excel = (props) => {
    return (
        <div
            className={
                props.isSet !== props.index ? "Chainexcel" : "Chainexcel Chaincurrent"
            }
        >
            {props.isDone ? props.value : ""}
        </div>
    );
};

function Chainchess() {
    const [doc, setDoc] = useState([]);//行走的方式，就是每一步的位置记录
    const [result, setResult] = useState([]);//将原本答案的二维数组concat为一唯数组
    const [done, setDone] = useState([]);//记录当前的点是否到达过
    const [row, setRow] = useState(10);//行数
    const [col, setCol] = useState(9);//列数
    const [active, setActive] = useState(0);//当前马所在点的坐标
    const [intervalTime, setIntervalTime] = useState(300);//马移动的间隔时间
    const [end, setend] = useState(true)//重新渲染的指针
    const [loading, setloading] = useState(true)//当前能否运行的指向

    const [fetchLoading, setfetchLoading] = useState(false)//当前能否运行的指向
    const [listLoading, setlistLoading] = useState(false)//当前能否运行的指向
    const [temprow, setTempRow] = useState(10);//行数
    const [tempcol, setTempCol] = useState(9);//列数
    const [X, setX] = useState(0)
    const [Y, setY] = useState(0)

    useEffect(() => {
        ensure()
    }, [end]);

    const ensurecolrow = () => {
        setCol(tempcol)
        setRow(temprow)
        setend(!end)
    }

    const ensure = async () => {
        // let fetchBody = qs.stringfy({
        //     "x":row,
        //     "y":col,
        //     "m":X,
        //     "n":Y
        // })
        let temp
        setfetchLoading(true)
        setlistLoading(true)
        //这里的服务是发向腾讯云服务器上的配置。所以需要等待
        //为什么有两个请求在这里呢？是因为一个搜索的顺序是顺时针方向，一个搜索的顺序是逆时针
        //经过大量实验表明逆时针卡住的往往能在顺时针的搜说中出来，这其实很容易想明白
        //如果第一个搜索请求超时就给第二个请求操作，超时的时间设置的是10s
        await fetch(`https://service-bek82cv8-1305114804.gz.apigw.tencentcs.com/release?x=${row}&y=${col}&m=${X}&n=${Y}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Cross-Origin-Resource-Policy': 'cross-origin'
            },
        })
            .then(res => res.json())
            .then(data => (temp = data, console.log(data)))
        console.log(temp)
        if (temp.errorCode === -1 || temp === null) {
            await fetch(`https://service-aj1qsgcs-1305114804.gz.apigw.tencentcs.com/release?x=${row}&y=${col}&m=${X}&n=${Y}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Cross-Origin-Resource-Policy': 'cross-origin'
                },
            })
                .then(res => res.json())
                .then(data => (temp = data, console.log(data)))
        }

        // if (temp.errorCode===-1||temp === null) {
        //     await fetch(`https://service-aj1qsgcs-1305114804.gz.apigw.tencentcs.com/release?x=${row}&y=${col}&m=${X}&n=${Y}`, {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json;charset=UTF-8',
        //             'Cross-Origin-Resource-Policy': 'cross-origin'
        //         },
        //     })
        //         .then(res => res.json())
        //         .then(data => (temp = data,console.log(data)))
        // }


        // let temp = data1 || data2;//得到当前的数组

        let arrDoc = Array(row * col).fill(null);
        let arrDone = Array(row * col).fill(false);
        let arrResult = Array(row * col).fill(null);
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                arrDoc[temp[i][j] - 1] = j + i * col;
                arrResult[j + i * col] = temp[i][j];
            }
        }
        setDoc(arrDoc);
        setDone(arrDone);
        setResult(arrResult);
        setActive(X * col + Y)
        setfetchLoading(false)
        setlistLoading(false)
    }

    const handleBegin = () => {
        setloading(false)

        console.log(done)
        let step = 0;
        let begin = setInterval(() => {
            let temp = done;
            temp[doc[step - 1]] = true;
            setActive(doc[step]);
            setDone(temp);
            step++;
            if (step == row * col) {
                clearInterval(begin);
                setTimeout(() => {
                    setend(!end)
                }, 3000);
                setloading(true)
            }
        }, intervalTime);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div
                className="Chainfield"
                style={{ height: row * 50 + 2, width: col * 50 + 2 }}
            >
                {result.map((value, index) => {
                    let theme;
                    if (parseInt(index / col) % 2 == 1) {
                        // console.log(index-col*parseInt(index/row));
                        theme =
                            (index - col * parseInt(index / col)) % 2 ? "brown" : "white";
                    } else {
                        theme =
                            (index - col * parseInt(index / col)) % 2 ? "white" : "brown";
                    }
                    return (
                        <Excel
                            key={index}
                            index={index}
                            value={value}
                            isDone={done[index]}
                            isSet={active}
                            theme={theme}
                        />
                    );
                })}
            </div>
            <div>
                <Slider style={{ margin: "20px 0px 0px 0px", width: "200px" }} min={50} max={800} onChange={(value) => setIntervalTime(value)} />
                <Divider orientation="left" style={{ margin: '20px 0px 5px' }} plain>调节横纵坐标</Divider>
                纵轴坐标：<InputNumber min={1} max={row} defaultValue={1} onChange={(value) => setX(value - 1)} />
                <br />
                横轴坐标：<InputNumber min={1} max={col} defaultValue={1} onChange={(value) => setY(value - 1)} />
                <br />
                <Button loading={fetchLoading} onClick={ensure} >确认</Button>
                <Button style={{ margin: "10px" }} onClick={loading ? handleBegin : () => {
                    message.error('程序正在运行中');
                }}>
                    begin
                </Button>
                <Divider orientation="left" style={{ margin: '20px 0px 0px', width: "200px" }}>走过的各位置的坐标</Divider>
                <div className="chainchesslist">
                    <Spin style={{height:'300px'}} spinning={listLoading} >
                        <ol >
                            {
                                doc.map((value, index) => {
                                    let one = parseInt(value / col)
                                    let two = value - one * col
                                    return <li key={value} style={{ margin: '0px' }} >{` ♞ jumpto (${one + 1} , ${two + 1})`}</li>
                                })
                            }
                        </ol>
                    </Spin>
                </div>
            </div>

        </div>
    );
}

export default Chainchess;
