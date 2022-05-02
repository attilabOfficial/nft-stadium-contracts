
const { expect, assert } = require("chai");

describe("StadiumNFT contract", function () {


    let StadiumNFT;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let checkPiece;

    let overrides = {
        value: ethers.utils.parseEther("1.0")
    };

    beforeEach(async function () {
        StadiumNFT = await ethers.getContractFactory("StadiumNFT");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        hardhatToken = await StadiumNFT.deploy("TokenMap", "TKM", "http://localhost",10);
        await hardhatToken.deployed();

        checkPiece = async (id) => {
            const piece = await hardhatToken.getPieceInfo(id);
            expect(piece['img']).to.equal('');
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
            checkPiece(1, owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(1);
        });

        it("Should mint 5 nft with different users", async function () {
            await hardhatToken.mint(owner.address,overrides);
            await hardhatToken.connect(addr1).mint(addr1.address,overrides);
            await hardhatToken.connect(addr2).mint(addr2.address,overrides);
            await hardhatToken.connect(addr1).mint(addr1.address,overrides);
            await hardhatToken.connect(addr2).mint(addr2.address,overrides);
            checkPiece(1, addr1.address);
            checkPiece(2, addr2.address);
            checkPiece(3, addr1.address);
            checkPiece(4, addr2.address);
            checkPiece(5, owner.address);

            expect(await hardhatToken.totalSupply()).to.equal(5);
        });

        it("Should add  10 nft", async function () {
            try {
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
            } catch (ex) {
                console.log("ex")
                assert(false, "An exception occured");

            }
            assert(true, "The contract did not throw.");
            expect(await hardhatToken.totalSupply()).to.equal(10);

        });
        it("Should not add more than 10 nft", async function () {
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
 
         });
         it("Should not change if not owner", async function () {
            await hardhatToken.mint(owner.address, overrides)
            await expect(hardhatToken.connect(addr1).changeImg(0, 'toto')).to.be.revertedWith("Not authorized");
         });
     });
});
    

    




