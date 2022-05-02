// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (access/Ownable.sol)

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
 * Adaptation of Owner class to add an admin to our contract
 */
abstract contract AdministrableAndOwnable is Context, Ownable{
    address private _admin;

    event AdminTransferred(address indexed previousAdmin, address indexed newAdmin);

    /*
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferAdmin(_msgSender());
    }

    /*
     * @dev Returns the address of the current admin.
     */
    function admin() public view virtual returns (address) {
        return _admin;
    }

    /*
     * @dev Throws if called by any account other than the admin.
     */
    modifier onlyAdminOrOwner() {
        require(admin() == _msgSender() || owner()==_msgSender(), "Admin: caller is not the admin");
        _;
    }

    function transferAdmin(address newAdmin) public virtual onlyOwner {
        require(newAdmin != address(0), "Ownable: new owner is the zero address");
        _transferAdmin(newAdmin);
    }


    function _transferAdmin(address newAdmin) internal virtual {
        address oldAdmin = _admin;
        _admin = newAdmin;
        emit AdminTransferred(oldAdmin, newAdmin);
    }
}