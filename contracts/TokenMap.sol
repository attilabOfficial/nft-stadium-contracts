//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./BasicNFT.sol";


contract MapContract is BasicNFT{

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
        require(_tokenId != 0);
        _mapPieceList[_tokenId].img=_img;
    }

    // Change the img associate with the piece
    function changeUrl(uint256 _tokenId, string calldata _url) public onlyTokenOwnerOrAdminOrOwner(_tokenId){
        require(_tokenId != 0);
        _mapPieceList[_tokenId].url=_url;
    }

    function getPieceInfo(uint256 _tokenId) public view returns(MapPiece memory){
        return _mapPieceList[_tokenId];
    }

}
