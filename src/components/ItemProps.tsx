import * as React from "react";
// import {Row,Col,Divider} from 'antd'
// import { PlusCircleFilled,UsergroupAddOutlined ,UserOutlined,SyncOutlined,CheckCircleFilled} from '@ant-design/icons';

export interface ItemProps {
    i:number
    type:number
    isActive:boolean
    value:number
    count:number
    secondCount:number
    people:number
    reinvest:number
    blocked:boolean
    placeArr:Array<any>
    placeSource:Array<any>
}
//
// interface ItemProp {
//     item:ItemProps
//     active:(type:number,level:number)=>void;
// }
//
// const Item:React.FC<ItemProp> = ({item,active})=>{
//
//     const {i,type,icon,value,count,secondCount,people,reinvest,blocked} = item;
//
//     const actived:boolean = icon ==="active"
//     if(type === 1){
//         return <div className="item-cst">
//             <div className="item-pr">
//                 <div className="item-border text-center text-bold" style={{borderColor:icon ==="active"?"#52c41a":""}}>
//                     {value}
//                 </div>
//                 <div className="left-icon">{actived?<CheckCircleFilled style={{ fontSize: '16px', color: '#52c41a' }}/>:<PlusCircleFilled onClick={()=>{active(1,i)}}/>}</div>
//                 {/*<div className="num">No.{i}</div>*/}
//             </div>
//             <Row className="circle">
//                 <Col span={8} className="text-center">
//                     <UserOutlined className="user-s1" style={{background:count>=1 && count <= 3&&actived?"#fff":""}}/>
//                 </Col>
//                 <Col span={8} className="text-center" style={{background: 1 < count&&actived?"#fff":""}}>
//                     <UserOutlined className="user-s1"/>
//                 </Col>
//                 <Col span={8} className="text-center" style={{background:count == 3&&actived?"#fff":""}}>
//                     <UserOutlined className="user-s1"/>
//                 </Col>
//             </Row>
//             <Row className="static">
//                 <Col span={12} className="text-center">
//                     <UsergroupAddOutlined className="icon-s0" />{people}
//                 </Col>
//                 <Col span={12} className="text-center">
//                     <SyncOutlined className="icon-s1"/>{reinvest}
//                 </Col>
//             </Row>
//         </div>
//     }else{
//         return <div className="item-cst">
//             <div className="item-pr">
//                 <div className="item-border text-center text-bold" style={{borderColor:icon ==="active"?"#52c41a":""}}>
//                     {value}
//                 </div>
//                 <div className="left-icon">{icon ==="active"?<CheckCircleFilled style={{ fontSize: '16px', color: '#52c41a' }}/>:<PlusCircleFilled onClick={()=>{active(2,i)}}/>}</div>
//             </div>
//
//             <Row className="circle">
//                 <Col span={12} className="text-center">
//                     <UserOutlined className="user-s1" style={{background:count>=1 && count <=2&&actived?"#fff":""}}/>
//                 </Col>
//                 <Col span={12} className="text-center">
//                     <UserOutlined className="user-s1"style={{background:1 < count&&actived?"#fff":""}}/>
//                 </Col>
//             </Row>
//             <Row className="circle">
//                 <Col span={8} className="text-center">
//                     <UserOutlined className="user-s2" style={{background:secondCount>=1 && secondCount <=3&&actived?"#fff":""}}/>
//                 </Col>
//                 <Col span={8} className="text-center">
//                     <UserOutlined className="user-s2" style={{background:secondCount >1&&actived?"#fff":""}}/>
//                 </Col>
//                 <Col span={8} className="text-center">
//                     <UserOutlined className="user-s2" style={{background:secondCount ==3&&actived?"#fff":""}}/>
//                 </Col>
//             </Row>
//             <Row className="static">
//                 <Col span={12} className="text-center">
//                     <UsergroupAddOutlined className="icon-s0" />{people}
//                 </Col>
//                 <Col span={12} className="text-center">
//                     <SyncOutlined className="icon-s1"/>{reinvest}
//                 </Col>
//             </Row>
//         </div>
//     }
//
// }

// export default Item