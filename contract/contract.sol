pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

import './common/seroInterface.sol';
import './common/SafeMath.sol';

contract ForSero is SeroInterface {

    using SafeMath for uint;

    struct User {
        uint id;
        address referrer;
        uint partnersCount;

        mapping(uint8 => bool) activeX3Levels;
        mapping(uint8 => bool) activeX6Levels;

        mapping(uint8 => X3) x3Matrix;
        mapping(uint8 => X6) x6Matrix;

        uint x3Income;
        uint x6Income;

        //add
        uint lastWithdrawTime;
        uint shareIncome;
        uint investAmount;
    }

    struct X3 {
        address currentReferrer;
        address[] referrals;
        bool blocked;
        uint reinvestCount;

        uint partnersCount;
        bool isExtraDividends;

        uint8[] placeArr;
        uint8[] placeSource;
    }

    struct X6 {
        address currentReferrer;
        address[] firstLevelReferrals;
        address[] secondLevelReferrals;
        bool blocked;
        uint reinvestCount;

        address closedPart;

        uint partnersCount;
        bool isExtraDividends;

        uint8[] placeArr;
        uint8[] placeSource;
    }

    //add global info
    struct detailView {
        uint lastUserId;
        uint total;
        uint balance;
        string cy;
        uint dayIndex;
        uint sharePool;
        uint totalShare;
        uint[] levelCountArr;
    }

    //add user info
    struct infoView {
        uint id;
        uint referrer;
        uint partnersCount;
        uint x3Income;
        uint x6Income;
        bool[] activeS3Levels;
        bool[] activeS6Levels;
        uint dayReward;
        uint lastWithdrawTime;
        uint shareIncome;
        uint investAmount;
    }

    uint8 public constant LAST_LEVEL = 12;

    mapping(address => User) public users;
    mapping(uint => address) public idToAddress;

    uint private lastUserId = 2;
    address public owner;

    mapping(uint8 => uint) public levelPrice;

    address private t1;
    address private t2;
    address private t3;
    address private t4;
    address private t5;

    string constant private CY = "SERO";

    uint private createTime;

    uint constant private levelPriceBase = 5 * 1e18; //prod

    uint constant public ONEDAY = 1 days; //prod: days
    uint[] public levelCountArr;
    uint private total;
    uint private totalShare;

    // event Registration(address indexed user, address indexed referrer, uint indexed userId, uint referrerId);
    // event Reinvest(address indexed user, address indexed currentReferrer, address indexed caller, uint8 matrix, uint8 level);
    // event Upgrade(address indexed user, address indexed referrer, uint8 matrix, uint8 level);
    // event MissedEthReceive(address indexed receiver, address indexed from, uint8 matrix, uint8 level);
    // event SentExtraEthDividends(address indexed from, address indexed receiver, uint8 matrix, uint8 level);

    constructor(address ownerAddress,address addr1,address addr2,address addr3,address addr4,address addr5) public {
        levelPrice[1] = levelPriceBase;
        for (uint8 i = 2; i <= LAST_LEVEL; i++) {
            levelPrice[i] = levelPrice[i-1] * 2;
        }

        owner = ownerAddress;
        t1 = addr1;
        t2 = addr2;
        t3 = addr3;
        t4 = addr4;
        t5 = addr5;

        User memory user = User({
            id: 1,
            referrer: address(0),
            partnersCount: uint(0),

            x3Income:uint(0),
            x6Income:uint(0),
            lastWithdrawTime:uint(0),
            shareIncome:uint(0),
            investAmount:uint(0)
        });

        users[owner] = user;
        idToAddress[1] = owner;

        for (i = 1; i <= LAST_LEVEL; i++) {
            users[owner].activeX3Levels[i] = true;
            users[owner].activeX6Levels[i] = true;
            levelCountArr.push(uint(0));
        }

        createTime = now;
    }

    function detail() view public returns(detailView){
        return detailView(lastUserId,total,balanceOf(),CY,_nowIndex(),balanceOf(),totalShare,levelCountArr);
    }

    function info() public view returns (infoView) {
        User storage user = users[msg.sender];
        bool[] memory _activeS3Levels = new bool[](LAST_LEVEL);
        bool[] memory _activeS6Levels = new bool[](LAST_LEVEL);
        for (uint i = 0; i < LAST_LEVEL; i++) {
            _activeS3Levels[i] = user.activeX3Levels[uint8(i + 1)];
            _activeS6Levels[i] = user.activeX6Levels[uint8(i + 1)];
        }

        return infoView(user.id,users[user.referrer].id,user.partnersCount,user.x3Income,user.x6Income,_activeS3Levels,_activeS6Levels,_calShare(),user.lastWithdrawTime,user.shareIncome,user.investAmount);
    }

    function balanceOf() view public returns (uint){
        return sero_balanceOf(CY);
    }

    function newUserPlace(address user, address referrer, uint8 matrix, uint8 level, uint8 place) private{
        if(matrix == 1){
            users[referrer].x3Matrix[level].placeArr.push(place);
            if(users[msg.sender].referrer == referrer){
                users[referrer].x3Matrix[level].placeSource.push(1);
            }else{
                users[referrer].x3Matrix[level].placeSource.push(2);
            }
        }else{
            users[referrer].x6Matrix[level].placeArr.push(place);
            if(users[msg.sender].referrer == referrer){
                users[referrer].x6Matrix[level].placeSource.push(1);
            }else{
                users[referrer].x6Matrix[level].placeSource.push(2);
            }
        }
    }

    function registrationExt(address referrerAddress) external payable {
        require(_isCy(sero_msg_currency()),"invalid currency");
        registration(msg.sender, referrerAddress);
    }

    function _isValid(address user,uint8 matrix, uint8 level) view private returns (bool){
        if (matrix == 1) {
            if(level>1 && users[user].activeX3Levels[level-1] == false){
                return false;
            }
        }else{
            if(level>1 && users[user].activeX6Levels[level-1] == false){
                return false;
            }
        }
        return true;
    }

    function buyNewLevel(uint8 matrix, uint8 level) external payable {
        require(_isCy(sero_msg_currency()),"invalid currency");

        require(isUserExists(msg.sender), "user is not exists. Register first.");
        require(matrix == 1 || matrix == 2, "invalid matrix");
        require(level > 1 && level <= LAST_LEVEL, "invalid level");
        require(msg.value == levelPrice[level], "invalid price");
        require(_isValid(msg.sender,matrix,level),"not allow");

        users[msg.sender].investAmount += msg.value;

        if (matrix == 1) {
            require(!users[msg.sender].activeX3Levels[level], "level already activated");

            if(users[msg.sender].activeX6Levels[level]){
                levelCountArr[level-1]++;
            }

            if (users[msg.sender].x3Matrix[level-1].blocked) {
                users[msg.sender].x3Matrix[level-1].blocked = false;
            }

            address freeX3Referrer = findFreeX3Referrer(msg.sender, level);
            users[msg.sender].x3Matrix[level].currentReferrer = freeX3Referrer;
            users[msg.sender].activeX3Levels[level] = true;
            updateX3Referrer(msg.sender, freeX3Referrer, level);

            // emit Upgrade(msg.sender, freeX3Referrer, 1, level);

        } else {
            require(!users[msg.sender].activeX6Levels[level], "level already activated");

            if(users[msg.sender].activeX3Levels[level]){
                levelCountArr[level-1]++;
            }

            if (users[msg.sender].x6Matrix[level-1].blocked) {
                users[msg.sender].x6Matrix[level-1].blocked = false;
            }

            address freeX6Referrer = findFreeX6Referrer(msg.sender, level);

            users[msg.sender].activeX6Levels[level] = true;
            updateX6Referrer(msg.sender, freeX6Referrer, level);

            // emit Upgrade(msg.sender, freeX6Referrer, 2, level);
        }
    }

    function registration(address userAddress, address referrerAddress) private {
        require(msg.value == (2 * levelPriceBase), "registration cost 100");
        require(!isUserExists(userAddress), "user exists");
        require(isUserExists(referrerAddress), "referrer not exists");
        uint32 size;
        assembly {
            size := extcodesize(userAddress)
        }
        require(size == 0, "cannot be a contract");

        User memory user = User({
            id: lastUserId,
            referrer: referrerAddress,
            partnersCount: 0,
            x3Income:uint(0),
            x6Income:uint(0),
            lastWithdrawTime:uint(0),
            shareIncome:uint(0),
            investAmount:msg.value
        });

        users[userAddress] = user;
        idToAddress[lastUserId] = userAddress;

        users[userAddress].referrer = referrerAddress;

        users[userAddress].activeX3Levels[1] = true;
        users[userAddress].activeX6Levels[1] = true;

        lastUserId++;
        users[referrerAddress].partnersCount++;

        levelCountArr[0]++;

        address freeX3Referrer = findFreeX3Referrer(userAddress, 1);
        users[userAddress].x3Matrix[1].currentReferrer = freeX3Referrer;
        updateX3Referrer(userAddress, freeX3Referrer, 1);

        updateX6Referrer(userAddress, findFreeX6Referrer(userAddress, 1), 1);

        // emit Registration(userAddress, referrerAddress, users[userAddress].id, users[referrerAddress].id);
    }

    function updateX3Referrer(address userAddress, address referrerAddress, uint8 level) private {
        users[referrerAddress].x3Matrix[level].referrals.push(userAddress);

        if (users[referrerAddress].x3Matrix[level].referrals.length < 3) {
            newUserPlace(userAddress, referrerAddress, 1, level, uint8(users[referrerAddress].x3Matrix[level].referrals.length));
            return sendDividends(referrerAddress, userAddress, 1, level);
        }

        newUserPlace(userAddress, referrerAddress, 1, level, 3);

        //close matrix
        users[referrerAddress].x3Matrix[level].referrals = new address[](0);

        users[referrerAddress].x3Matrix[level].placeArr=new uint8[](0);
        users[referrerAddress].x3Matrix[level].placeSource=new uint8[](0);

        if (!users[referrerAddress].activeX3Levels[level+1] && level != LAST_LEVEL) {
            users[referrerAddress].x3Matrix[level].blocked = true;
        }

        //create new one by recursion
        if (referrerAddress != owner) {
            //check referrer active level
            address freeReferrerAddress = findFreeX3Referrer(referrerAddress, level);
            if (users[referrerAddress].x3Matrix[level].currentReferrer != freeReferrerAddress) {
                users[referrerAddress].x3Matrix[level].currentReferrer = freeReferrerAddress;
            }

            users[referrerAddress].x3Matrix[level].reinvestCount++;

            // emit Reinvest(referrerAddress, freeReferrerAddress, userAddress, 1, level);
            updateX3Referrer(referrerAddress, freeReferrerAddress, level);
        } else {
            sendDividends(owner, userAddress, 1, level);
            users[owner].x3Matrix[level].reinvestCount++;
            // emit Reinvest(owner, address(0), userAddress, 1, level);
        }
    }

    function updateX6Referrer(address userAddress, address referrerAddress, uint8 level) private {
        require(users[referrerAddress].activeX6Levels[level], "500. Referrer level is inactive");

        if (users[referrerAddress].x6Matrix[level].firstLevelReferrals.length < 2) {
            users[referrerAddress].x6Matrix[level].firstLevelReferrals.push(userAddress);

            newUserPlace(userAddress, referrerAddress, 2, level, uint8(users[referrerAddress].x6Matrix[level].firstLevelReferrals.length));

            //set current level
            users[userAddress].x6Matrix[level].currentReferrer = referrerAddress;

            if (referrerAddress == owner) {
                return sendDividends(referrerAddress, userAddress, 2, level);
            }

            address ref = users[referrerAddress].x6Matrix[level].currentReferrer;
            users[ref].x6Matrix[level].secondLevelReferrals.push(userAddress);

            uint len = users[ref].x6Matrix[level].firstLevelReferrals.length;

            if ((len == 2) &&
                (users[ref].x6Matrix[level].firstLevelReferrals[0] == referrerAddress) &&
                (users[ref].x6Matrix[level].firstLevelReferrals[1] == referrerAddress)) {
                if (users[referrerAddress].x6Matrix[level].firstLevelReferrals.length == 1) {
                    newUserPlace(userAddress, ref, 2, level, 5);
                } else {
                    newUserPlace(userAddress, ref, 2, level, 6);
                }
            }  else if ((len == 1 || len == 2) &&
                    users[ref].x6Matrix[level].firstLevelReferrals[0] == referrerAddress) {
                if (users[referrerAddress].x6Matrix[level].firstLevelReferrals.length == 1) {
                    newUserPlace(userAddress, ref, 2, level, 3);
                } else {
                    newUserPlace(userAddress, ref, 2, level, 4);
                }
            } else if (len == 2 && users[ref].x6Matrix[level].firstLevelReferrals[1] == referrerAddress) {
                if (users[referrerAddress].x6Matrix[level].firstLevelReferrals.length == 1) {
                    newUserPlace(userAddress, ref, 2, level, 5);
                } else {
                    newUserPlace(userAddress, ref, 2, level, 6);
                }
            }

            return updateX6ReferrerSecondLevel(userAddress, ref, level);
        }

        users[referrerAddress].x6Matrix[level].secondLevelReferrals.push(userAddress);

        if (users[referrerAddress].x6Matrix[level].closedPart != address(0)) {
            if ((users[referrerAddress].x6Matrix[level].firstLevelReferrals[0] ==
                users[referrerAddress].x6Matrix[level].firstLevelReferrals[1]) &&
                (users[referrerAddress].x6Matrix[level].firstLevelReferrals[0] ==
                users[referrerAddress].x6Matrix[level].closedPart)) {

                updateX6(userAddress, referrerAddress, level, true);
                return updateX6ReferrerSecondLevel(userAddress, referrerAddress, level);
            } else if (users[referrerAddress].x6Matrix[level].firstLevelReferrals[0] ==
                users[referrerAddress].x6Matrix[level].closedPart) {
                updateX6(userAddress, referrerAddress, level, true);
                return updateX6ReferrerSecondLevel(userAddress, referrerAddress, level);
            } else {
                updateX6(userAddress, referrerAddress, level, false);
                return updateX6ReferrerSecondLevel(userAddress, referrerAddress, level);
            }
        }

        if (users[referrerAddress].x6Matrix[level].firstLevelReferrals[1] == userAddress) {
            updateX6(userAddress, referrerAddress, level, false);
            return updateX6ReferrerSecondLevel(userAddress, referrerAddress, level);
        } else if (users[referrerAddress].x6Matrix[level].firstLevelReferrals[0] == userAddress) {
            updateX6(userAddress, referrerAddress, level, true);
            return updateX6ReferrerSecondLevel(userAddress, referrerAddress, level);
        }

        if (users[users[referrerAddress].x6Matrix[level].firstLevelReferrals[0]].x6Matrix[level].firstLevelReferrals.length <=
            users[users[referrerAddress].x6Matrix[level].firstLevelReferrals[1]].x6Matrix[level].firstLevelReferrals.length) {
            updateX6(userAddress, referrerAddress, level, false);
        } else {
            updateX6(userAddress, referrerAddress, level, true);
        }

        updateX6ReferrerSecondLevel(userAddress, referrerAddress, level);
    }

    function updateX6(address userAddress, address referrerAddress, uint8 level, bool x2) private {
        if (!x2) {
            users[users[referrerAddress].x6Matrix[level].firstLevelReferrals[0]].x6Matrix[level].firstLevelReferrals.push(userAddress);

            newUserPlace(userAddress, users[referrerAddress].x6Matrix[level].firstLevelReferrals[0], 2, level, uint8(users[users[referrerAddress].x6Matrix[level].firstLevelReferrals[0]].x6Matrix[level].firstLevelReferrals.length));
            newUserPlace(userAddress, referrerAddress, 2, level, 2 + uint8(users[users[referrerAddress].x6Matrix[level].firstLevelReferrals[0]].x6Matrix[level].firstLevelReferrals.length));

            //set current level
            users[userAddress].x6Matrix[level].currentReferrer = users[referrerAddress].x6Matrix[level].firstLevelReferrals[0];
        } else {
            users[users[referrerAddress].x6Matrix[level].firstLevelReferrals[1]].x6Matrix[level].firstLevelReferrals.push(userAddress);

            newUserPlace(userAddress, users[referrerAddress].x6Matrix[level].firstLevelReferrals[1], 2, level, uint8(users[users[referrerAddress].x6Matrix[level].firstLevelReferrals[1]].x6Matrix[level].firstLevelReferrals.length));
            newUserPlace(userAddress, referrerAddress, 2, level, 4 + uint8(users[users[referrerAddress].x6Matrix[level].firstLevelReferrals[1]].x6Matrix[level].firstLevelReferrals.length));

            //set current level
            users[userAddress].x6Matrix[level].currentReferrer = users[referrerAddress].x6Matrix[level].firstLevelReferrals[1];
        }
    }

    function updateX6ReferrerSecondLevel(address userAddress, address referrerAddress, uint8 level) private {
        if (users[referrerAddress].x6Matrix[level].secondLevelReferrals.length < 4) {
            return sendDividends(referrerAddress, userAddress, 2, level);
        }

        address[] memory x6 = users[users[referrerAddress].x6Matrix[level].currentReferrer].x6Matrix[level].firstLevelReferrals;

        if (x6.length == 2) {
            if (x6[0] == referrerAddress ||
                x6[1] == referrerAddress) {
                users[users[referrerAddress].x6Matrix[level].currentReferrer].x6Matrix[level].closedPart = referrerAddress;
            } else if (x6.length == 1) {
                if (x6[0] == referrerAddress) {
                    users[users[referrerAddress].x6Matrix[level].currentReferrer].x6Matrix[level].closedPart = referrerAddress;
                }
            }
        }

        users[referrerAddress].x6Matrix[level].firstLevelReferrals = new address[](0);
        users[referrerAddress].x6Matrix[level].secondLevelReferrals = new address[](0);
        users[referrerAddress].x6Matrix[level].closedPart = address(0);

        if (!users[referrerAddress].activeX6Levels[level+1] && level != LAST_LEVEL) {
            users[referrerAddress].x6Matrix[level].blocked = true;
        }

        users[referrerAddress].x6Matrix[level].reinvestCount++;
        users[referrerAddress].x6Matrix[level].placeArr=new uint8[](0);
        users[referrerAddress].x6Matrix[level].placeSource=new uint8[](0);

        if (referrerAddress != owner) {
            address freeReferrerAddress = findFreeX6Referrer(referrerAddress, level);

            // emit Reinvest(referrerAddress, freeReferrerAddress, userAddress, 2, level);
            updateX6Referrer(referrerAddress, freeReferrerAddress, level);
        } else {
            // emit Reinvest(owner, address(0), userAddress, 2, level);
            sendDividends(owner, userAddress, 2, level);
        }
    }

    function findFreeX3Referrer(address userAddress, uint8 level) public view returns(address) {
        while (true) {
            if (users[users[userAddress].referrer].activeX3Levels[level]) {
                return users[userAddress].referrer;
            }

            userAddress = users[userAddress].referrer;
        }
    }

    function findFreeX6Referrer(address userAddress, uint8 level) public view returns(address) {
        while (true) {
            if (users[users[userAddress].referrer].activeX6Levels[level]) {
                return users[userAddress].referrer;
            }

            userAddress = users[userAddress].referrer;
        }
    }

    function usersX3Matrix(address userAddress, uint8 level) public view returns(address, address[] memory, bool,uint,uint,bool,uint8[] memory,uint8[] memory) {
        X3 storage x3 = users[userAddress].x3Matrix[level];
        return (x3.currentReferrer,
                x3.referrals,
                x3.blocked,
                x3.reinvestCount,
                x3.partnersCount,
                x3.isExtraDividends,
                x3.placeArr,
                x3.placeSource);
    }

    function usersX6Matrix(address userAddress, uint8 level) public view returns(address, address[] memory, address[] memory, bool, address,uint,uint,bool,uint8[] memory,uint8[] memory) {
        X6 storage x6 = users[userAddress].x6Matrix[level];
        return (x6.currentReferrer,
                x6.firstLevelReferrals,
                x6.secondLevelReferrals,
                x6.blocked,
                x6.closedPart,
                x6.reinvestCount,
                x6.partnersCount,
                x6.isExtraDividends,
                x6.placeArr,
                x6.placeSource);
    }

    function isUserExists(address user) public view returns (bool) {
        return (users[user].id != 0);
    }

    function findEthReceiver(address userAddress, address _from, uint8 matrix, uint8 level) private returns(address, bool) {
        address receiver = userAddress;
        bool isExtraDividends;
        if (matrix == 1) {
            while (true) {
                if (users[receiver].x3Matrix[level].blocked) {
                    // emit MissedEthReceive(receiver, _from, 1, level);
                    isExtraDividends = true;
                    receiver = users[receiver].x3Matrix[level].currentReferrer;
                } else {
                    return (receiver, isExtraDividends);
                }
            }
        } else {
            while (true) {
                if (users[receiver].x6Matrix[level].blocked) {
                    // emit MissedEthReceive(receiver, _from, 2, level);
                    isExtraDividends = true;
                    receiver = users[receiver].x6Matrix[level].currentReferrer;
                } else {
                    return (receiver, isExtraDividends);
                }
            }
        }
    }

    function sendDividends(address userAddress, address _from, uint8 matrix, uint8 level) private {
        (address receiver, bool isExtraDividends) = findEthReceiver(userAddress, _from, matrix, level);

        uint256 _value = levelPrice[level];

        uint256 _income = _value.mul(60).div(100);

        if (matrix == 1) {
            users[receiver].x3Matrix[level].partnersCount++;
            users[receiver].x3Income += _income;
            users[receiver].x3Matrix[level].isExtraDividends = isExtraDividends;
        } else {
            users[receiver].x6Matrix[level].partnersCount++;
            users[receiver].x6Income += _income;
            users[receiver].x6Matrix[level].isExtraDividends = isExtraDividends;
        }

        total += _value;

        require(sero_send_token(t1,CY,_value.mul(2).div(100)),"send to t1 fail");
        require(sero_send_token(t2,CY,_value.mul(1).div(100)),"send to t2 fail");
        require(sero_send_token(t3,CY,_value.mul(5).div(1000)),"send to t3 fail");
        require(sero_send_token(t4,CY,_value.mul(5).div(1000)),"send to t4 fail");
        require(sero_send_token(t5,CY,_value.mul(1).div(100)),"send to t5 fail");

        require(sero_send_token(receiver,CY,_income),"send receiver fail");

    }

    function withdrawShare() public returns(uint){
        uint _rewards = _calShare();
        require(_rewards>0,"rewards == 0");
        users[msg.sender].lastWithdrawTime = now;
        users[msg.sender].shareIncome += _rewards;

        totalShare +=_rewards;

        require(sero_send_token(msg.sender,CY,_rewards),"send rewards fail");
        return _rewards;
    }

    function _calShare() internal view returns(uint){
        User memory user = users[msg.sender];
        uint _maxShare = (user.investAmount).mul(2);
        if(user.shareIncome >= _maxShare || _selfDayIndex() == _nowIndex() ){
            return 0;
        }else{
            uint _leftMaxShare = _maxShare.sub(user.shareIncome);
            uint _rewards = uint(0);
            uint _sharePool = balanceOf();
            for(uint8 i=9;i<=12;i++){
                if(users[msg.sender].activeX3Levels[i] && users[msg.sender].activeX6Levels[i]){
                    _rewards += _sharePool.div(45).div(4).div(levelCountArr[i-1]);

                }
            }
            if(_rewards>_leftMaxShare){
                _rewards = _leftMaxShare;
            }
            return _rewards;
        }
        return 0;
    }

    function reInvest() payable public{

        require(msg.sender != owner, "not allow owner");

        require(_isCy(sero_msg_currency()),"invalid currency");

        uint min = 5120;
        if(users[msg.sender].activeX3Levels[10] && users[msg.sender].activeX6Levels[10]){
            min = 10240;
        }else if(users[msg.sender].activeX3Levels[11] && users[msg.sender].activeX6Levels[11]){
            min = 20480;
        }else if(users[msg.sender].activeX3Levels[12] && users[msg.sender].activeX6Levels[12]){
            min = 40960;
        }

        require(msg.value >= min * 1e18 ,"invalid value");

        users[msg.sender].investAmount += msg.value;

        total += msg.value;

        require(sero_send_token(t1,CY,msg.value.mul(5).div(100)),"reInvest failed");
    }

    function _nowIndex() private view returns(uint) {
        return (now + 8*60*60) / ONEDAY;
    }

    function _selfDayIndex() private view returns(uint) {
        return (users[msg.sender].lastWithdrawTime + 8*60*60) / ONEDAY;
    }

    function _isCy(string memory _cy) internal view returns (bool){
        return _compareStr(_cy,CY);
    }

    function _compareStr(string memory a, string memory b) internal pure returns (bool) {
        if(bytes(a).length == 0 && bytes(b).length == 0){
            return true;
        }
        if (bytes(a).length != bytes(b).length) {
            return false;
        }
        for (uint i = 0; i < bytes(a).length; i ++) {
            if(bytes(a)[i] != bytes(b)[i]) {
                return false;
            }
        }
        return true;
    }

}