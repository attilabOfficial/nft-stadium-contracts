
const { expect, assert } = require("chai");

describe("StadiumNFT contract", function () {


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
  

    describe("Deployment", function () {

        it("Should set the right owner", async function () {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        it("Size of map should be specified ", async function () {
            expect(await hardhatToken.maxSupply()).to.equal(10);
        });
        it("Nbr of minted NFT should be 0 ", async function () {
            expect(await hardhatToken.totalSupply()).to.equal(0);
        });
    });

    describe("Mint", async function () {
        it("Should mint one NFT", async function () {
          
            await hardhatToken.mint(owner.address, overrides);
            checkPiece(0, owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(1);
        });

        it("Should mint 5 nft with different users", async function () {
            await hardhatToken.mint(owner.address,overrides);
            await hardhatToken.connect(addr1).mint(addr1.address,overrides);
            await hardhatToken.connect(addr2).mint(addr2.address,overrides);
            await hardhatToken.connect(addr1).mint(addr1.address,overrides);
            await hardhatToken.connect(addr2).mint(addr2.address,overrides);
            checkPiece(0, owner.address);
            checkPiece(1, addr1.address);
            checkPiece(2, addr2.address);
            checkPiece(3, addr1.address);
            checkPiece(4, addr2.address);

            expect(await hardhatToken.totalSupply()).to.equal(5);
        });

        it("Should add  10 nft", async function () {
            try {
               await mint10();
            } catch (ex) {
                console.log(ex)
                assert(false, "An exception occured");
            }
            assert(true, "The contract did not throw.");
            expect(await hardhatToken.totalSupply()).to.equal(10);

        });
        it("Should not add more than 10 nft", async function () {
                await mint10();
                await expect(hardhatToken.connect(addr2).mint(addr2.address,overrides)).to.be.revertedWith("Max supply");
        });
        it("Should not mint if don't have enought money", async function () {
            await expect(hardhatToken.mint(owner.address,{
                value: ethers.utils.parseEther("0.01")
            })).to.be.revertedWith("Not enought money");

        });
    });
    describe("Change imgage", async function () {
        it("Should change the img", async function () {
             await hardhatToken.mint(owner.address, overrides);
             await hardhatToken.changeImg(0, 'toto');
             const piece = await hardhatToken.getPieceInfo(0);
             expect(piece['img']).to.equal('toto');

             const stadiumMap = await hardhatToken.getStadium();
             expect(stadiumMap[0][0]).to.equal('toto');
 
         });

         it("Should change multiple img", async function () {
            await mint10();
            await hardhatToken.changeImg(0, 'img0');
            await hardhatToken.connect(addr2).changeImg(2, 'img2');
            await hardhatToken.connect(addr1).changeImg(3, 'img3');
            await hardhatToken.connect(addr2).changeImg(4, 'img4');

            const piece = await hardhatToken.getPieceInfo(0);
            expect(piece['img']).to.equal('img0');
            const piece2 = await hardhatToken.getPieceInfo(2);
            expect(piece2['img']).to.equal('img2');
            const piece3 = await hardhatToken.getPieceInfo(3);
            expect(piece3['img']).to.equal('img3');
            const piece4 = await hardhatToken.getPieceInfo(4);
            expect(piece4['img']).to.equal('img4');


            const stadiumMap = await hardhatToken.getStadium();
            expect(stadiumMap[0][0]).to.equal('img0');
            expect(stadiumMap[0][1]).to.equal('');
            expect(stadiumMap[0][3]).to.equal('img3');
            expect(stadiumMap[0][4]).to.equal('img4');
            expect(stadiumMap[0][5]).to.equal('');
            expect(stadiumMap[0][6]).to.equal('');
            expect(stadiumMap[0][7]).to.equal('');
            expect(stadiumMap[0][8]).to.equal('');
            expect(stadiumMap[0][9]).to.equal('');

            expect(stadiumMap[1][0]).to.equal('');
            expect(stadiumMap[1][1]).to.equal('');
            expect(stadiumMap[1][3]).to.equal('');
            expect(stadiumMap[1][4]).to.equal('');
            expect(stadiumMap[1][5]).to.equal('');
            expect(stadiumMap[1][6]).to.equal('');
            expect(stadiumMap[1][7]).to.equal('');
            expect(stadiumMap[1][8]).to.equal('');
            expect(stadiumMap[1][9]).to.equal('');


        });
         it("Should not change if not owner", async function () {
            await hardhatToken.mint(owner.address, overrides)
            await expect(hardhatToken.connect(addr1).changeImg(0, 'toto')).to.be.revertedWith("Not authorized");
         });
     });
});
    

    




