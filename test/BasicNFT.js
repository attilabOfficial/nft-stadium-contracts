
const { expect, assert } = require("chai");

describe("Basic NFT features", function () {


    let StadiumNFT;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let checkPiece;
    let mint10;

    let overrides = {
        value: ethers.utils.parseEther("1.0")
    };

    beforeEach(async function () {
        StadiumNFT = await ethers.getContractFactory("StadiumNFT");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatToken = await StadiumNFT.deploy("TokenMap", "TKM", "http://localhost",10);
        await hardhatToken.deployed();

        checkPiece = async (id, owner) => {
            const piece = await hardhatToken.getPieceInfo(id);
            const ownerOf = await hardhatToken.ownerOf(id)
            expect(ownerOf).to.equal(owner);
            expect(piece['img']).to.equal('');
        }

        mint10 = async(_)=>{
            await hardhatToken.mint(owner.address,overrides);
            await hardhatToken.connect(addr1).mint(addr1.address,overrides);
            await hardhatToken.connect(addr2).mint(addr2.address,overrides);
            await hardhatToken.connect(addr1).mint(addr1.address,overrides);
            await hardhatToken.connect(addr2).mint(addr2.address,overrides);
            await hardhatToken.mint(owner.address,overrides);
            await hardhatToken.connect(addr1).mint(addr1.address,overrides);
            await hardhatToken.connect(addr2).mint(addr2.address,overrides);
            await hardhatToken.connect(addr1).mint(addr1.address,overrides);
            await hardhatToken.connect(addr2).mint(addr2.address,overrides);
        }
    });
  

    describe("Check balance and total supply after minting", function () {
        it("Balance sould be initilize to 0", async function () {
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(0);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(0);
            expect(await hardhatToken.totalSupply()).to.equal(0);

        });
        it("Balance sould be 1 after minting an NFT", async function () {
            await hardhatToken.mint(owner.address, overrides);
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(1);
            expect(await hardhatToken.totalSupply()).to.equal(1);
        });
        it("Check balance of everybody after minting 10 nft", async function () {
            await mint10();
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(2);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(4);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(4);
            expect(await hardhatToken.totalSupply()).to.equal(10);
        });
    });

    describe("Check balance and total supply after transfert", function () {
    
        it("Balance sould be 1 and 0 after transfert an NFT", async function () {
            await hardhatToken.mint(owner.address, overrides);
            await hardhatToken.transferFrom(owner.address, addr1.address, 0);

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(0);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(1);
            expect(await hardhatToken.totalSupply()).to.equal(1);

            const ownerOf = await hardhatToken.ownerOf(0)
            expect(ownerOf).to.equal(addr1.address);

        });
        it("Check transfert of everybody after minting 10 nft", async function () {
            await mint10();
            await hardhatToken.connect(addr2).transferFrom(addr2.address, addr1.address, 2);
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(2);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(5);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(3);
            expect(await hardhatToken.totalSupply()).to.equal(10);
        });
        it("Not owner sould not be able to transfert NFF if not approved", async function () {
            await mint10();
            await expect(hardhatToken.connect(addr1).transferFrom(addr2.address, addr1.address, 2)).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");;
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(2);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(4);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(4);
            expect(await hardhatToken.totalSupply()).to.equal(10);
        });
        it("Not owner sould be able to transfert NFF if approved", async function () {
            await mint10();
            await hardhatToken.connect(addr2).approve(addr1.address, 2);
            await hardhatToken.connect(addr1).transferFrom(addr2.address, addr1.address, 2);
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(2);
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(5);
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(3);
            expect(await hardhatToken.totalSupply()).to.equal(10);
        });

    });

  
});
    

    




