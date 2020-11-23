import * as React from "react";
import {Row,Col} from 'antd'
import {ItemProps} from "./ItemProps";
import { PlusCircleFilled,UsergroupAddOutlined ,UserOutlined,SyncOutlined,CheckCircleFilled,ExclamationCircleFilled} from '@ant-design/icons';


interface Props {
    list: Array<ItemProps>
    active:(type:number,level:number)=>void;
    isUserExists:boolean,
}

const V3:React.FC<Props> = ({list,active,isUserExists})=>{

    return <>
      <div className="basis">
        <div className="foin">
        {/* <div className="fill" style={{width:'2.3px'}}></div> */}
        <div className="info">
            <Row>
            {
                list.map((v,index)=>{
                    const {i, type, isActive, value, count, secondCount, people, reinvest, blocked,placeArr,placeSource} = v;
                    console.log("list>>> ",index,v)
                    return <Col xs={12} sm={12} md={8} lg={6} xl={4} xxl={4} key={"1"+index}>
                       <div className="item-cst">
                           <div className="item-pr">
                               <div className="item-border text-center text-bold" style={{borderColor:isActive?"#52c41a":""}}>
                                   {value}
                               </div>
                               {
                                   isUserExists?<div className="left-icon">{
                                       blocked?<ExclamationCircleFilled style={{ fontSize: '20px', color: '#c49c42' }} />:
                                           isActive?<CheckCircleFilled style={{ fontSize: '20px', color: '#52c41a' }}/>:<PlusCircleFilled style={{ fontSize: '20px' }} onClick={()=>{active(2,i)}}/>}</div>:""
                               }
                               <div className="num">{i}</div>
                           </div>

                           <Row className="circle">
                               {
                                   [0,1].map(i=>{
                                       let bg:string = "user-s2 ";
                                       const index:number = placeArr.indexOf((i+1)+"");
                                       if(index>-1){
                                           const ps = placeSource[index];
                                           if(ps && ps=="1"){
                                               bg = "active"
                                           }else if(ps && ps=="2"){
                                               bg = "overflow-partner"
                                           }else if(ps && ps=="3"){
                                               bg = "overflow"
                                           }else if(ps && ps=="4"){
                                               bg = "bottom-up"
                                           }
                                       }else{
                                           bg += " non-active"
                                       }
                                       return <Col span={12} className="text-center">
                                           <UserOutlined className={bg}/>
                                       </Col>
                                   })
                               }

                           </Row>
                           <Row className="circle">
                               {
                                   [2,4,3,5].map(i=>{
                                       let bg:string = "user-s1 ";
                                       const index:number = placeArr.indexOf((i+1)+"");
                                       if(index>-1){
                                           const ps = placeSource[index];
                                           if(ps && ps=="1"){
                                               bg = "active"
                                           }else if(ps && ps=="2"){
                                               bg = "overflow-partner"
                                           }else if(ps && ps=="3"){
                                               bg = "overflow"
                                           }else if(ps && ps=="4"){
                                               bg = "bottom-up"
                                           }
                                       }else{
                                           bg += " non-active"
                                       }
                                       return <Col span={6} className="text-center">
                                           <UserOutlined className={bg}/>
                                       </Col>
                                   })
                               }
                           </Row>
                           <Row className="static">
                               <Col span={12} className="text-center">
                                   <UsergroupAddOutlined className="icon-s0" />{people}
                               </Col>
                               <Col span={12} className="text-center">
                                   <SyncOutlined className="icon-s1"/>{reinvest}
                               </Col>
                           </Row>
                       </div>
                    </Col>
                })
            }
            </Row>
        </div>
        </div>
        </div>
    </>
}

export default V3