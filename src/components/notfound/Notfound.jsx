import React from "react";
import { Result, Button } from 'antd';
import { useHistory } from 'react-router-dom'

export default function Notfound() {
    const loa = useHistory()
    return (
        <Result
            style={{padding:'10px'}}
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={()=>loa.push('/')} >返回主页面</Button>}
        />
    );
}
