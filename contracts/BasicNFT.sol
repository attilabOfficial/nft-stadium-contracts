//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./AdministrableAndOwnable.sol";


contract BasicNFT is ERC721Enumerable, AdministrableAndOwnable{
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.01 ether;
    uint256 public maxSupply = 425;
    bool public paused = false;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        uint256 _maxSupply
    ) ERC721(_name, _symbol) AdministrableAndOwnable() Ownable() {
        setBaseURI(_initBaseURI);
        setMaxSupply(_maxSupply);
    }
      // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function mint(address _to, uint256 _tokenToMint) public payable {
        require(!paused, "Contract is paused");
        require(msg.value >= cost, "Not enought money");
        require(_tokenIds.current() < maxSupply,  "Max supply");
        require(_exists(_tokenToMint)==false, "ERC721: token already minted");
        require(_tokenToMint < maxSupply,  "Out of bounds");

        _safeMint(_to, _tokenToMint);
        _tokenIds.increment();

    }

     function tokenURI(uint256 tokenId)
            public
            view
            virtual
            override
            returns (string memory)
    {
        require(
        _exists(tokenId),
        "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
            : "";
    }
    modifier onlyTokenOwnerOrAdminOrOwner(uint256 _tokenId) {
        require(msg.sender == ownerOf(_tokenId)|| msg.sender == admin() || msg.sender == owner(), "Not authorized");
    _;
    }

    //only owner
    function setCost(uint256 _newCost) public onlyOwner {
        cost = _newCost;
    }
    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }
    function setMaxSupply(uint256 _newMaxSupply) public onlyOwner {
        maxSupply = _newMaxSupply;
    }

    function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    function withdraw() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }

}
