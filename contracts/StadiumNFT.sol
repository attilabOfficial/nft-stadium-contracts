//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;
import "./BasicNFT.sol";


contract StadiumNFT is BasicNFT{

    struct MapPiece {
      string img;
      string url;
    }
    // List of all our MapPieces
    mapping (uint => MapPiece) private _mapPieceList;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        uint256 _maxSupply
    ) BasicNFT(_name, _symbol, _initBaseURI, _maxSupply) {
    }

    // Change the img associate with the piece
    function changeImg(uint256 _tokenId, string calldata _img) public onlyTokenOwnerOrAdminOrOwner(_tokenId){
        require(_tokenId <= totalSupply(), "NFT don't exist");
        _mapPieceList[_tokenId].img=_img;
    }

    // Change the img associate with the piece
    function changeUrl(uint256 _tokenId, string calldata _url) public onlyTokenOwnerOrAdminOrOwner(_tokenId){
        require(_tokenId <= totalSupply(), "NFT don't exist");
        _mapPieceList[_tokenId].url=_url;
    }

    function getPieceInfo(uint256 _tokenId) public view returns(MapPiece memory){
        return _mapPieceList[_tokenId];
    }

    function getStadium() public view returns(string[] memory, string[] memory){
        string[] memory imgs = new string[](totalSupply());
        string[] memory urls = new string[](totalSupply());

        for (uint i = 0; i < totalSupply(); i++) {
            imgs[i] = _mapPieceList[i].img;
            urls[i] = _mapPieceList[i].url;
        }

        return(imgs, urls);
    }

}
