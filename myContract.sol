<<<<<<< HEAD
pragma solidity >=0.7.0 <0.9.0;

contract MyContract{
    int bal;

    constructor() public
    {
        bal = 1;
    }

    function getBalance() public view returns(int){
        return bal;
    }

    function withdraw(int amt) public {
        bal = bal - amt;
    }     

    function deposit(int amt) public{
        bal = bal + amt;
    }
}
=======
pragma solidity >=0.7.0 <0.9.0;

contract MyContract{
    int bal;

    constructor() public
    {
        bal = 1;
    }

    function getBalance() public view returns(int){
        return bal;
    }

    function withdraw(int amt) public {
        bal = bal - amt;
    }     

    function deposit(int amt) public{
        bal = bal + amt;
    }
}
>>>>>>> 93172e558be27447eed9db178577f441b1029442
