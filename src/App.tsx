import * as React from 'react';

import {
    Layout,
    Tabs,
    Space,
    Button,
    Tag,
    Spin,
    List,
    Modal,
    message,
    Input,
    Divider,
    Row,
    Col,
    Statistic,
    Descriptions, Radio, InputNumber
} from 'antd'
import {UserOutlined,SyncOutlined} from '@ant-design/icons'
import './App.less';
import './css/style.css'
import MyInfo from "./components/MyInfo";
import V3 from "./components/V3"
import V6 from "./components/V6"
import {ItemProps} from "./components/ItemProps";
import service from "./service/service";
import * as utils from './common/utils'
import contract, {Detail, Info, X3, X6} from './service/contract'
import * as config from "./service/config";
import BigNumber from "bignumber.js";
import i18n from './i18n'

const {Header, Footer, Content} = Layout;
const {TabPane} = Tabs;
function callback(key: any) {
    console.log(key);
}
interface Props{
    setRefCode:(v:any)=>void;
    register:()=>void;
    info:Info
    account:any
    detail:Detail
}
export interface State {
    accounts:Array<any>
    account:any
    info:Info
    isUserExists:boolean
    x3Map?:Map<number,X3>
    x6Map?:Map<number,X6>
    refCode?:any
    spinning:boolean
    detail:Detail,
    investAmount:any,
    customerValue:any
}

class App extends React.Component<any,State> {

    state:State = {
        info:{id:0,referrer:"",partnersCount:0,x6Income:new BigNumber(0),x3Income:new BigNumber(0),activeS6Levels:[],activeS3Levels:[],dayReward:new BigNumber(0),lastWithdrawTime:0,shareIncome:new BigNumber(0),investAmount:new BigNumber(0)},
        accounts:[],
        account:{},
        isUserExists:false,
        spinning:false,
        investAmount:"5120",
        customerValue:0,
        detail:{lastId:1,total:new BigNumber(0),balance:new BigNumber(0),cy:config.useCoin,dayIndex:0,sharePool:new BigNumber(0),levelCountArr:[1,1,1,1,1,1,1,1,1,1,1,1],totalShare:new BigNumber(0)}
    }

    componentDidMount(): void {
        service.initDApp().catch();

        this.getAccountList().then(()=> {

        })
        let interId:any = sessionStorage.getItem("interId")
        if(interId){
            clearInterval(interId)
        }
        interId = setInterval(()=>{
            this.genInfo().catch();
        },5 * 1000)
        sessionStorage.setItem("interId",interId)

    }

    async getAccountList(){
        const data:any = await service.accountList();
        let act:any = data?data.find((v:any)=>{
            return !!v.IsCurrent
        }):{}
        if(!act) {
            act = act?act:data[0];
        }
        this.setState({
            accounts: data,
            account: act
        })
        this.genInfo(act).catch();
    }

    async genInfo(account?:any){
        if(!account){
            account = this.state.account;
        }
        const mainPKr:string = account.MainPKr;
        const info:any = await contract.info(mainPKr)
        const detail:any = await contract.detail(mainPKr)
        const isUserExists:any = await contract.isUserExists(mainPKr)
        this.setState({
            isUserExists:isUserExists,
            info:info,
            detail:detail
        })

        this.genMatrix(info).catch();
    }

    async genMatrix(info:Info){
        const {account,isUserExists} = this.state;
        const {activeS3Levels,activeS6Levels} = info;
        if(account && account.MainPKr){
            const mainPKr = account.MainPKr;
            const x3Map:Map<number,X3> = new Map()
            const x6Map:Map<number,X6> = new Map()
            for(let i=1;i<=12;i++){
                if(isUserExists){
                    if(!!activeS3Levels[i-1]){
                        const usersX3Matrix = await contract.usersX3Matrix(mainPKr,i)
                        x3Map.set(i,usersX3Matrix)
                    }

                    if(!!activeS6Levels[i-1]){
                        const usersX6Matrix = await contract.usersX6Matrix(mainPKr,i)
                        x6Map.set(i,usersX6Matrix)
                    }

                }
            }

            this.setState({
                x3Map:x3Map,
                x6Map:x6Map
            })
        }

    }

    setAccount = (v:any,modal:any)=>{
        if(v){
            this.setState({
                account:v
            })
            // const o:any = document.getElementsByClassName("ant-popover");
            // if(o){
            //     o[0].className += 'ant-popover-hidden';
            // }
            this.genInfo(v).catch()
            if(modal){
                modal.destroy();
            }
        }
    }

    active = (type:number,level:number) =>{
        const {account,info} = this.state;
        let modalId:any = null;
        modalId = Modal.confirm({
            title:i18n.t("buyNewLevel"),
            content:<div>
                {i18n.t("active")}{type==1?"X3":"X4"}{i18n.t("matrix")}Level{level}{i18n.t("need")}<strong>{config.levelPrice * 2 ** (level-1)}</strong> {config.useCoin}
            </div>,
            onCancel:()=>{
                modalId.destroy();
            },
            onOk:(e)=>{
                modalId.destroy();
                contract.activeMatrix(account,type,level).then((hash)=>{
                    message.success(hash)
                    this.showSpin(hash);
                }).catch(error=>{
                    const err = typeof e === "object"?e.message:error;
                    message.error(err)
                })
            }
        })
    }

    setRefCode = (v:any)=>{
        if(v){
            this.setState({
                refCode:v
            })
        }
    }

    register =()=>{
        const {refCode,account} = this.state;
        if(!refCode){
            message.warning(i18n.t("inputCode"))
            return
        }
        contract.registrationExt(account,refCode).then(hash=>{
            message.success(hash)
            this.showSpin(hash);
        }).catch((e:any)=>{
            const err = typeof e === "object"?e.message:e;
            message.error(err);
        })
    }

    reward = ()=>{
        console.log("reward");
        const {account} = this.state;
        contract.withdrawShare(account).then(hash=>{
            message.success(hash)
            this.showSpin(hash);
        }).catch((e:any)=>{
            const err = typeof e === "object"?e.message:e;
            message.error(err);
        })
    }

    onChange= (e:any)=>{
        this.setState({
            customerValue:"",
            investAmount : e.target.value
        })
    }

    setCustomerValue = (v:any) =>{
        this.setState({
            investAmount:"",
            customerValue:v
        })
        console.log("v>>> ",v);
    }

    reInvest = ()=>{
        console.log("reInvest");
        const {info} = this.state;
        let maxLevel = 0;
        for(let i=0;i<12;i++){
            if(info.activeS3Levels[i] && info.activeS6Levels[i]){
                maxLevel = i+1;
            }
        }
        let min = 5120;
        const options = [];
        if(maxLevel == 9){
            min = 5120;
            options.push(<>
                <Radio.Button value="5120">5120</Radio.Button>
                <Radio.Button value="10240">10240</Radio.Button>
                <Radio.Button value="20480">20480</Radio.Button>
                <Radio.Button value="40960">40960</Radio.Button>
            </>)
        }else if(maxLevel == 10){
            min = 10240;
            options.push(<>
                <Radio.Button value="10240">10240</Radio.Button>
                <Radio.Button value="20480">20480</Radio.Button>
                <Radio.Button value="40960">40960</Radio.Button>
            </>)
        }else if(maxLevel == 11){
            min = 20480;
            options.push(<>
                <Radio.Button value="20480">20480</Radio.Button>
                <Radio.Button value="40960">40960</Radio.Button>
            </>)
        }else if(maxLevel == 12){
            min = 40960;
            options.push(<>
                <Radio.Button value="40960">40960</Radio.Button>
            </>)
        }
        Modal.confirm({
            title:"复投",
            content:<div>
                <Radio.Group onChange={this.onChange} size={"small"} defaultValue={this.state.investAmount}>
                    {options}
                </Radio.Group>
                <br/><br/>
                <InputNumber style={{width:"220px"}} min={min} size={"small"} placeholder={"输入自定义金额"} onChange={(v:any)=>{this.setCustomerValue(v)}}  />
            </div>,
            onOk:()=>{
                this.reInvestSub();
            }
        })
    }

    reInvestSub = ()=>{
        let {account,investAmount,customerValue} = this.state;
        if(!investAmount){
            investAmount = customerValue;
        }
        if(!investAmount){
            message.error("请选择金额或者自定义输入金额!")
            return
        }
        contract.reInvest(account,utils.toValue(investAmount,18)).then(hash=>{
            message.success(hash)
            this.showSpin(hash);
        }).catch((e:any)=>{
            const err = typeof e === "object"?e.message:e;
            message.error(err);
        })
    }

    showAccountModal = ()=>{

        const {accounts} = this.state;

        if(accounts){
            let modalId:any = null;
            modalId = Modal.info({
                icon:<UserOutlined/>,
                title:i18n.t("selectAccount"),
                content:<List>
                    {
                        accounts.map(v=>{
                            return <List.Item onClick={()=>this.setAccount(v,modalId)}>{v.Name}({utils.ellipsis(v.MainPKr)})</List.Item>
                        })
                    }
                </List>
            })
        }
    }

    showSpin(hash:string){
        this.setState({
            spinning:true
        })
        let interId:any ;
        interId = setInterval(()=>{
            service.rpc("sero_getTransactionReceipt",[hash]).then((rest:any)=>{
                if(rest.status){
                    clearInterval(interId)
                    this.setState({
                        spinning:false
                    })
                    this.genInfo().catch()
                }
            })
        },1000)
    }
    render() {
        const {account,accounts,info,x3Map,x6Map,isUserExists,spinning,detail} = this.state;

        console.log(detail,"detail")
        let value:any = '0.000'
        let balance = account && account.Balance;
        if(balance && !(balance instanceof Map)){
            const keys = Object.keys(balance);
            const tmp:Map<string,string> = new Map();
            for(let key of keys){
                tmp.set(key,balance[key])
            }
            if(tmp.size == 0){
                tmp.set(config.useCoin,"0")
            }
            balance = tmp;
        }
        if(balance){
            value = utils.fromValue(balance.get(config.useCoin),18).toFixed(3,1)
        }
        // let startMainPKr = account.MainPkr.substr(0,15);
        // let endMainPKr = account.MainPKr.substring(account.MainPKr.length-15);
        const itemX3:Array<ItemProps> = [];
        const itemX6:Array<ItemProps> = [];
        for(let i=1;i<=12;i++){
            const item:ItemProps = { isActive:false, value:config.levelPrice * 2 ** (i-1), count:0,secondCount:0, people:0, reinvest:0, type:1, i:i ,blocked:false,placeArr:[],placeSource:[]};
            if(x3Map &&x3Map.has(i)){
                const x3:X3 | undefined = x3Map.get(i);

                if(x3){
                    const count:number = x3.referrals?x3.referrals.length:0;
                    const reinvest:number = x3.reinvestCount?x3.reinvestCount:0;
                    const partnersCount:number = x3.partnersCount?x3.partnersCount:0;
                    item.isActive = true;
                    item.blocked = x3.blocked;
                    item.count = count;
                    item.people = partnersCount;
                    item.reinvest = reinvest;
                    item.placeArr = x3.placeArr;
                    item.placeSource = x3.placeSource;
                }
            }
            itemX3.push(item)

            const item6:ItemProps = { isActive:false, value:config.levelPrice * 2 ** (i-1), count:0,secondCount:0, people:0, reinvest:0, type:2, i:i ,blocked:false,placeArr:[],placeSource:[]};
            if(x6Map &&x6Map.has(i)){
                const x6:X6 | undefined = x6Map.get(i);
                if(x6){

                    const firstCount:number = x6.firstLevelReferrals?x6.firstLevelReferrals.length:0;
                    const secondCount:number = x6.secondLevelReferrals?x6.secondLevelReferrals.length:0;
                    const reinvestCount:number = x6.reinvestCount?x6.reinvestCount:0;
                    const partnersCount:number = x6.partnersCount?x6.partnersCount:0;

                    item6.isActive = true
                    item6.blocked = x6.blocked
                    item6.count = firstCount
                    item6.secondCount = secondCount
                    item6.people = partnersCount
                    item6.reinvest = reinvestCount
                    item6.placeArr = x6.placeArr
                    item6.placeSource = x6.placeSource
                }
            }
            itemX6.push(item6)
        }

        return <>

            <Layout>
                <Content
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        margin: 0,
                        minHeight: 280,
                    }}
                >
                    <Spin tip="Pending..." spinning={spinning}>
                        <div className="text-center" >
                            <div className="head-ct">
                                <img src={require("./image/logo-s.png")} width="100%"/>
                            </div>
                            <Space className="text-center head-ct2">
                                <span className="all text-large text-bold">{account.Name}</span>
                                {value}{config.useCoin}
                                <button  className="btn" onClick={()=>{this.showAccountModal()}}>{i18n.t("switch")}</button>
                            </Space>
                            {/*<Descriptions title="" column={2}>*/}
                            {/*    <Descriptions.Item label=""><Statistic title="ALL PARTICIPANTS" valueStyle={{fontFamily:"NeogreyMedium",color:"#1EA4C1",fontWeight:600}} groupSeparator={""} value={detail.lastId-1}/></Descriptions.Item>*/}
                            {/*    <Descriptions.Item label=""><Statistic title="TOTAL" valueStyle={{fontFamily:"NeogreyMedium",color:"#DD74C8",fontWeight:600}} precision={2} groupSeparator={""} suffix="SERO" value={detail.total.toNumber()}/></Descriptions.Item>*/}
                            {/*    <Descriptions.Item label=""><Statistic title="TOTAL REWARDS" valueStyle={{fontFamily:"NeogreyMedium",color:"#DD74C8",fontWeight:600}} precision={2} groupSeparator={""} suffix="SERO" value={detail.totalShare.toNumber()}/></Descriptions.Item>*/}
                            {/*    <Descriptions.Item label=""><Statistic title="奖池" valueStyle={{fontFamily:"NeogreyMedium",color:"#DD74C8",fontWeight:600}} precision={2} groupSeparator={""} suffix="SERO" value={detail.sharePool.toNumber()}/></Descriptions.Item>*/}
                            {/*</Descriptions>*/}
                            <div  className="head-ct2">
                                <img src={require("./image/head-ct.png")} width="100%"/>
                            </div>

                        </div>


                        <div className="Next">
                            <div className="card-container">
                                <Tabs onChange={callback} type="card">
                                    <TabPane  tab={<span className="text-large text-bold tab-left" >INFO</span>} key="1">
                                        <MyInfo info={info} account={account} setRefCode={this.setRefCode} register={this.register} detail={detail} reward={this.reward} reInvest={this.reInvest} doUpdate={()=> {
                                            console.log("do update....");
                                            this.genInfo().catch()
                                        }}/>

                                    </TabPane>
                                    <TabPane tab={<span className="text-large text-bold">X3</span>} key="2">
                                        <div>
                                            <V3 list={itemX3} active={this.active} key={"X3"} isUserExists={isUserExists}/>
                                        </div>
                                    </TabPane>
                                    <TabPane tab={<span className="text-large text-bold">X4</span>} key="3">
                                        <V6 list={itemX6} active={this.active} key="X4" isUserExists={isUserExists}/>
                                    </TabPane>
                                </Tabs>
                                <div className="footer">

                                    <img className="footers" src={require("./image/footer.png")} alt=""/>
                                </div>
                                <Space direction="vertical">
                                    <Row className="static">
                                        <Col span={24} style={{marginBottom:"12px"}}>
                                            <UserOutlined className="active"/> {i18n.t("yourInvite")}
                                        </Col>
                                        <Col span={24}  style={{marginBottom:"12px"}}>
                                            <UserOutlined className="overflow-partner"/> {i18n.t("overflow")}
                                        </Col>
                                    </Row>
                                </Space>

                            </div>
                        </div>
                    </Spin>

                </Content>
            </Layout>

        </>;
    }
}

export default App;
