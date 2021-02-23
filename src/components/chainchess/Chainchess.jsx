import React, { useState, useEffect } from "react";
import { Button, Slider, message, InputNumber, Divider } from "antd";
import { alo } from "../../alo";
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

    const [temprow, setTempRow] = useState(10);//行数
    const [tempcol, setTempCol] = useState(9);//列数
    const [X, setX] = useState(0)
    const [Y, setY] = useState(0)

    useEffect(() => {
        let temp = alo(row, col, X, Y);//得到当前的数组

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
        setActive(X*col+Y)
    }, [end]);

    const ensurecolrow = () => {
        setCol(tempcol)
        setRow(temprow)
        setend(!end)
    }

    const ensure = () => {
        let temp = alo(row, col, X, Y);//得到当前的数组

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
        setActive(X*col+Y)
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
                style={{ height: row * 60 + 2, width: col * 60 + 2 }}
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
                <Slider style={{ margin: "20px 0px 0px 0px",width:"200px" }} min={200} max={800} onChange={(value) => setIntervalTime(value)} />
                <Divider orientation="left" style={{margin:'20px 0px 5px'}}  plain>调节横纵坐标</Divider>
                纵轴坐标：<InputNumber min={1} max={row} defaultValue={1} onChange={(value)=>setX(value-1)} />
                <br/>
                横轴坐标：<InputNumber min={1} max={col} defaultValue={1} onChange={(value)=>setY(value-1)} />
                <br />
                <Button onClick={ensure} >确认</Button>
                <Button style={{ margin: "10px" }} onClick={loading ? handleBegin : () => {
                    message.error('程序正在运行中');
                }}>
                    begin
                </Button>
            </div>

        </div>
    );
}

export default Chainchess;
