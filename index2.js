const MACHINE_RATE = 1/60;
const POLLUTION_RATE = 1/30;
const CDI_INTERVAL = 51;        // corruption, decay, interest ms interval
const INTEREST_RATE = 0.0025;    // per second
const BONUS_TIME = 1500; // ms that bonus clicky will show for

mCorruptionBurn = 10;   //amount of corruption reduced via burn button
mDecayBurn = 20;    //amount of decay reduced via burn button

objGlobals = {
    mArrIntervalIDs: [],
    
    mBlnPaused: false,
    mBlnPickAvailable: true,
    mBlnWorkersAvailable: true,
    mBlnTNTAvailable: true,
    mBlnCaffeineAvailable: true,
    mBlnDraglineAvailable: true,
    mBlnMineAvailable: true,
    mBlnAutomatedAvailable: true,
    mBlnClicked: false, // if bonus already clicked on
    mBlnTripped: false,

    mIncrement: 1,  // click multiplier
    mCount: 0,
    mCountWorth: 0, // net worth
    mCountGold: 0,  // total gold in hand
    mGoldRate: 0,
    mIncrementGold: 0,
    mMarketCount: 0,
    mMarketMax: 10,
    mTradingPostCount: 0,
    mTradingPostMax: 10,
    mBankCount: 0,
    mBankMax: 5,
    mStockmarketCount: 0,
    mStockmarketMax: 2,
    mWallStreetCount: 0,
    mTradeCount: 0,
    mFactoryCount: 0,
    mFactoryMax: 5,
    mPick_ShovelCount: 0,
    mPick_ShovelMax: 1,
    mWorkerCount: 0,
    mWorkerMax: 1,
    mCaffeineCount: 0,
    mCaffeineMax: 1,
    mTNTCount: 0,
    mTNTMax: 1,
    mDraglinesCount: 0,
    mDraglinesMax: 1,
    mMinesCount: 0,
    mAutomatedCount: 0,
    mMachines: 0,
    mMachineRate: 0,
    mMachineInterval: 0,
    mPollutionCount: 0,
    mPollutionRate: 0,
    mPollutionGold: 5,  // gold/sec rate of each pollution 
    mPollutionInterval: 0,
    mIncrementPollution: 0,
    mRecyclingCount: 0,
    mRecyclingMax: 5,
    mCourthouseCount: 0,
    mCourthouseMax: 5,
    mLandCount: 0,
    mLandMax: 3,
    mLandMultiplier: 1,
    mAICount: 0,
    mCorruption: 0,
    mCorruptionOffset: 0,
    mCorruptionLandOffset: 0,
    mInterest: 0,
    mDecayRate: 0,
    mDecayOffset: 0,     // wear and tear (decay) burn
    mDecayLandOffset: 1,
    mBonusTimeout: 0,
    mSteemBurnt: 0,
    mRecordRate: 0,
    msStartTime: 0, 
    msPauseTime: 0,
    msRestartTime: 0,
    mTimeOffset: 0,      // handles game timer after game pauses
    //mSecElapsed: 0
};

objGlobalsCost = {
    mMarket: 20,
    mTradingPost: 60,
    mBank: 300,
    mStockmarket: 5000,
    mWallStreet: 20000,
    mTrade: 30000,
    mFactory: 250,
    mRecycling: 250,
    mCourthouse: 350,
    mLand: 100000,
    mAi: 500000,
    mPick_Shovel: 150,
    mWorkers: 500,
    mCaffeine: 1000,
    mTNT: 2000,
    mDragline: 10000,
};

window.addEventListener('load', function() {
    document.getElementById("nugget").ondragstart = function() { return false; };
});

function increment() {
    if(!objGlobals.mBlnPaused) {
        objGlobals.mCountGold += objGlobals.mIncrement;

        if(objGlobals.mCountGold < 10000) {
            //document.getElementById("countGold").innerHTML = objGlobals.mCountGold.toFixed(0);
        document.getElementById("countGold").innerHTML = Math.floor(objGlobals.mCountGold);
        } else if (objGlobals.mGoldRate < 100) {
            document.getElementById("countGold").innerHTML = (objGlobals.mCountGold/10000).toFixed(1) + "k";
        }

        objGlobals.mCount += 1;
        if(objGlobals.mCount === 1) {   //test if first click of the game
            objGlobals.msStartTime = Date.now();
            startIntervals();
            bonuses();
        }

        incrementWorth(objGlobals.mIncrement);
    }
}

function startIntervals() {
    objGlobals.mArrIntervalIDs.length = 0;
    objGlobals.mArrIntervalIDs.push(setInterval(gameClock, 1000));
    objGlobals.mArrIntervalIDs.push(setInterval(corruption_decay_interest, CDI_INTERVAL));
    objGlobals.mArrIntervalIDs.push(setInterval(growthRate, 4110));
    objGlobals.mArrIntervalIDs.push(setInterval(enableBuildings, 510));  //also enables upgrades
}

function bonuses() {
    if(!objGlobals.mBlnPaused) {
        var rand = 0;

        if(objGlobals.mCountWorth < 500000) {
            rand = Math.random() * (30 - 10) + 10;   // between 10 and 30 seconds
            rand = rand*1000;
        } else {
            rand = Math.random() * (25 - 5) + 5;   // between 5 and 25 seconds
            rand = rand*1000;
        }

        objGlobals.mBonusTimeout = setTimeout(bonus, rand);
    } else {
        clearTimeout(objGlobals.mBonusTimeout);
    }
    
}

function bonus() {
    if(objGlobals.mAICount === 1) {
        //Arnie bonus
        // popup more frequently towards end of skynet, if possible
    }

    if(objGlobals.mCountWorth < 10000) {
        //small bonuses
        let rand = Math.floor((Math.random() * 2) + 1);

        if(rand === 1) {
            showBonus("luckystrike", "100");
        } else if(rand === 2) {
            showBonus("prospector", "1")
        }

    } else if(objGlobals.mCountWorth >= 10000 && objGlobals.mCountWorth < 100000) {
        let rand = Math.floor((Math.random() * 3) + 1);

        if(rand === 1) {
            showBonus("luckystrike", "200");
        } else if(rand === 2) {
            showBonus("prospector", "2");
        } else if(rand === 3) {
            showBonus("sheriff", "1");
        }

    } else if(objGlobals.mCountWorth >= 100000 && objGlobals.mCountWorth < 200000) {
        let rand = Math.floor((Math.random() * 4) + 1);
        
        if(rand === 1) {
            showBonus("luckystrike", "500");
        } else if(rand === 2) {
            showBonus("prospector", "3");
        } else if(rand === 3) {
            showBonus("wd40", "5");
        } else if(rand === 4) {
            showBonus("sheriff", "2");
        }

    } else if(objGlobals.mCountWorth >= 200000 && objGlobals.mCountWorth < 300000) {
        //large bonuses
        let rand = Math.floor((Math.random() * 5) + 1);
        
        if(rand === 1) {
            showBonus("luckystrike", "1000");
        } else if(rand === 2) {
            showBonus("prospector", "5");
        } else if(rand === 3) {
            showBonus("oil", "8");
        } else if(rand === 4) {
            showBonus("sheriff", "3");
        } else if(rand === 5) {
            showBonus("trees", "1")
        }

    } else if(objGlobals.mCountWorth >= 300000 && objGlobals.mCountWorth < 500000) {
        //large bonuses
        let rand = Math.floor((Math.random() * 5) + 1);
        
        if(rand === 1) {
            showBonus("luckystrike", "2000");
        } else if(rand === 2) {
            showBonus("prospector", "7");
        } else if(rand === 3) {
            showBonus("oil", "9");
        } else if(rand === 4) {
            showBonus("sheriff", "4");
        } else if(rand === 5) {
            showBonus("trees", "1")
        }

    } else if(objGlobals.mCountWorth >= 500000) {
        //large bonuses
        let rand = Math.floor((Math.random() * 5) + 1);
        
        if(rand === 1) {
            showBonus("luckystrike", "3000");
        } else if(rand === 2) {
            showBonus("prospector", "8");
        } else if(rand === 3) {
            showBonus("oil", "10");
        } else if(rand === 4) {
            showBonus("sheriff", "7");
        } else if(rand === 5) {
            showBonus("trees", "2")
        }
    }

    bonuses();
}

function showBonus(bonusType, bonus) {
    var img = document.createElement("img");
    img.src = "./images/" + bonusType + ".png";
    img.classList.add("bonus");
    img.classList.add("unselectable");
    img.style.position = "absolute";
    img.style.left = "900px";
    img.style.top = "300px";
    img.style.zIndex = "10";
    img.dataset.type = bonusType;
    img.dataset.bonus = bonus;
    img.ondragstart = function() { return false; };
    img.addEventListener("click", clicked);

    //document.getElementsByTagName("body")[0].appendChild(img);
    document.getElementById("surface").appendChild(img);

    setTimeout(clearBonus, BONUS_TIME, img);
}

function clicked(e) {
    if(!objGlobals.mBlnClicked) {
        var el = e.target;
        var popup = document.getElementById("popup");

        switch (el.dataset.type) {
            case "luckystrike":
                objGlobals.mCountGold += parseInt(el.dataset.bonus);
                popup.innerHTML = "Eureka! You found " + el.dataset.bonus + " gold";

                if(objGlobals.mCountGold < 10000) {
                    document.getElementById("countGold").innerHTML = Math.floor(objGlobals.mCountGold);
                } else {
                    document.getElementById("countGold").innerHTML = (objGlobals.mCountGold/1000).toFixed(1) + "k";
                }
                break;
            case "wd40":
                objGlobals.mDecayOffset -= parseInt(el.dataset.bonus);
                popup.innerHTML = "Lubrication! -" + el.dataset.bonus + " wear & tear";
                break;  
            case "prospector":
                objGlobals.mGoldRate += parseInt(el.dataset.bonus);
                document.getElementById("goldRate").innerHTML = objGlobals.mGoldRate.toFixed(1);
                popup.innerHTML = "Help has arrived! +" + el.dataset.bonus + " gold/sec";
                break;
            case "sheriff":
                objGlobals.mCorruptionOffset -= parseInt(el.dataset.bonus);
                popup.innerHTML = "There's a new sheriff in town! -" + el.dataset.bonus + " corruption";
                break;
            case "trees":
                objGlobals.mPollutionCount -= 1;
                //objGlobals.mGoldRate += objGlobals.mPollutionGold;  //***************** NEEDS ATTENTION: Will increase gold rate for pollution of less than one ***********
                popup.innerHTML = "You planted 1000 trees! -" + el.dataset.bonus + " pollution";
                
                break;
            case "oil":
                objGlobals.mDecayOffset -= parseInt(el.dataset.bonus);
                popup.innerHTML = "Lubrication! -" + el.dataset.bonus + " wear & tear";
                break;
        }

        popup.style.opacity = "100";
        setTimeout(function(){ popup.style.opacity = "0"; }, 2500); 
    }

    objGlobals.mBlnClicked = true;    
}

function clearBonus(el) {
    el.style.opacity = "0";

    setTimeout(function(){ document.getElementById("surface").removeChild(el); }, 200);
    objGlobals.mBlnClicked = false;
}

function purchase(el) {
    if(el.id === "market" && objGlobals.mCountGold >= objGlobalsCost.mMarket && objGlobals.mMarketCount < objGlobals.mMarketMax) {
        objGlobals.mCountGold = objGlobals.mCountGold-objGlobalsCost.mMarket;
        
        if(objGlobals.mCountGold < objGlobalsCost.mMarket) {
            document.getElementById("market").style.color = "#838383";
            document.getElementById("market").style.cursor = "default";
        }

        objGlobals.mMarketCount += 1;
        document.getElementById("markets").innerHTML = objGlobals.mMarketCount;

        objGlobals.mGoldRate += 0.1 * objGlobals.mLandMultiplier;
        objGlobalsCost.mMarket *= 1.1;
        objGlobalsCost.mMarket = objGlobalsCost.mMarket.toFixed();
        var cost = checkThousands(objGlobalsCost.mMarket);
        document.getElementById("marketCost").innerHTML = cost;

    } else if(el.id === "tradingPost" && objGlobals.mCountGold >= objGlobalsCost.mTradingPost && objGlobals.mTradingPostCount < objGlobals.mTradingPostMax) {
        objGlobals.mCountGold = objGlobals.mCountGold-objGlobalsCost.mTradingPost;

        if(objGlobals.mCountGold < objGlobalsCost.mTradingPost) {
            document.getElementById("tradingPost").style.color = "#838383";
            document.getElementById("tradingPost").style.cursor = "default";
        }

        objGlobals.mTradingPostCount += 1;
        document.getElementById("tradingPosts").innerHTML = objGlobals.mTradingPostCount;

        objGlobals.mGoldRate += 0.5 * objGlobals.mLandMultiplier;
        objGlobalsCost.mTradingPost *= (1.1 + (0.05 * objGlobals.mLandCount));
        objGlobalsCost.mTradingPost = objGlobalsCost.mTradingPost.toFixed();
        var cost = checkThousands(objGlobalsCost.mTradingPost);
        document.getElementById("tradingPostCost").innerHTML = cost;

    } else if(el.id === "factory" && objGlobals.mCountGold >= objGlobalsCost.mFactory && objGlobals.mFactoryCount < objGlobals.mFactoryMax) {
        objGlobals.mCountGold = objGlobals.mCountGold-objGlobalsCost.mFactory;

        if(objGlobals.mCountGold < objGlobalsCost.mFactory) {
            document.getElementById("factory").style.color = "#838383";
            document.getElementById("factory").style.cursor = "default";
        }

        objGlobals.mFactoryCount += 1;
        document.getElementById("factories").innerHTML = objGlobals.mFactoryCount;

        //increase machine rate
        objGlobals.mMachineRate += MACHINE_RATE;    // MACHINE_RATE machines per second
        clearInterval(objGlobals.mMachineInterval);
        objGlobals.mMachineInterval = setInterval(incrementMachines, 1000, objGlobals.mMachineRate);

        var machineRate = MACHINE_RATE * 60 * objGlobals.mFactoryCount;
        document.getElementById("machineRate").innerHTML = machineRate;


        //increase pollution rate
        objGlobals.mPollutionRate += POLLUTION_RATE;    // POLLUTION_RATE pollution per second
        clearInterval(objGlobals.mPollutionInterval);
        objGlobals.mPollutionInterval = setInterval(incrementPollution, 1000, objGlobals.mPollutionRate);

        var pollutionRate = (POLLUTION_RATE * 60 * objGlobals.mFactoryCount) - objGlobals.mRecyclingCount;
        pollutionRate < 0 ? pollutionRate = 0 : true;
        document.getElementById("pollutionRate").innerHTML = pollutionRate.toFixed(0);

        // adjust factory cost for each additional land
        objGlobalsCost.mFactory *= (1.1 + (0.05 * objGlobals.mLandCount));
        objGlobalsCost.mFactory =  objGlobalsCost.mFactory.toFixed();
        var cost = checkThousands(objGlobalsCost.mFactory);
        document.getElementById("factoryCost").innerHTML = cost;

    } else if(el.id === "recyclingCentre" && objGlobals.mCountGold >= objGlobalsCost.mRecycling && objGlobals.mRecyclingCount < objGlobals.mRecyclingMax && objGlobals.mFactoryCount > 0) {
        objGlobals.mCountGold = objGlobals.mCountGold-objGlobalsCost.mRecycling;

        if(objGlobals.mCountGold < objGlobalsCost.mRecycling) {
            document.getElementById("recyclingCentre").style.color = "#838383";
            document.getElementById("recyclingCentre").style.cursor = "default";
        }

        objGlobals.mRecyclingCount += 1;
        document.getElementById("recyclingCentres").innerHTML = objGlobals.mRecyclingCount;

        //reduce pollution rate
        objGlobals.mPollutionRate -= POLLUTION_RATE/2;    // POLLUTION_RATE pollution per second
        clearInterval(objGlobals.mPollutionInterval);
        objGlobals.mPollutionInterval = setInterval(incrementPollution, 1000, objGlobals.mPollutionRate);

        var pollutionRate = (POLLUTION_RATE * 60 * objGlobals.mFactoryCount) - objGlobals.mRecyclingCount;
        pollutionRate < 0 ? pollutionRate = 0 : true;
        document.getElementById("pollutionRate").innerHTML = pollutionRate.toFixed(0);

        //increase cost of recycling centre for each additional land
        objGlobalsCost.mRecycling *= (1.1 + (0.05 * objGlobals.mLandCount));
        objGlobalsCost.mRecycling = objGlobalsCost.mRecycling.toFixed();
        var cost = checkThousands(objGlobalsCost.mRecycling);
        document.getElementById("recyclingCost").innerHTML = cost;
    

    } else if(el.id ==="bank" && objGlobals.mCountGold >= objGlobalsCost.mBank && objGlobals.mBankCount < objGlobals.mBankMax) {
        objGlobals.mCountGold = objGlobals.mCountGold-objGlobalsCost.mBank;

        if(objGlobals.mCountGold < objGlobalsCost.mBank) {
            document.getElementById("bank").style.color = "#838383";
            document.getElementById("bank").style.cursor = "default";
        }

        objGlobals.mBankCount += 1;
        document.getElementById("banks").innerHTML = objGlobals.mBankCount;

        objGlobals.mGoldRate += 3 * objGlobals.mLandMultiplier;
        objGlobalsCost.mBank *= (1.1 + (0.05 * objGlobals.mLandCount));
        objGlobalsCost.mBank = objGlobalsCost.mBank.toFixed();
        var cost = checkThousands(objGlobalsCost.mBank);
        document.getElementById("bankCost").innerHTML = cost;

    } else if(el.id === "stockMarket" && objGlobals.mCountGold >= objGlobalsCost.mStockmarket && objGlobals.mStockmarketCount < objGlobals.mStockmarketMax) {
        objGlobals.mCountGold -= objGlobalsCost.mStockmarket;

        if(objGlobals.mCountGold < objGlobalsCost.mStockmarket) {
            document.getElementById("stockMarket").style.color = "#838383";
            document.getElementById("stockMarket").style.cursor = "default";
        }

        objGlobals.mStockmarketCount += 1;
        document.getElementById("stockmarkets").innerHTML = objGlobals.mStockmarketCount;

        objGlobals.mGoldRate += 60 * objGlobals.mLandMultiplier;
        objGlobalsCost.mStockmarket *= (1.1 + (0.05 * objGlobals.mLandCount));
        objGlobalsCost.mStockmarket = objGlobalsCost.mStockmarket.toFixed();
        var cost = checkThousands(objGlobalsCost.mStockmarket);
        document.getElementById("stockmarketCost").innerHTML = cost;

    } else if(el.id === "wallStreet" && objGlobals.mCountGold >= objGlobalsCost.mWallStreet && objGlobals.mWallStreetCount < 1 && objGlobals.mLandCount === 3) {
        objGlobals.mCountGold -= objGlobalsCost.mWallStreet;

        if(objGlobals.mCountGold < objGlobalsCost.mWallStreet) {
            document.getElementById("wallStreet").style.color = "#838383";
            document.getElementById("wallStreet").style.cursor = "default";
        }

        objGlobals.mWallStreetCount += 1;
        document.getElementById("wallStreets").innerHTML = objGlobals.mWallStreetCount;

        objGlobals.mGoldRate += 200;

    //add trade in here
    } else if(el.id === "courthouse" && objGlobals.mCountGold >= objGlobalsCost.mCourthouse && objGlobals.mCourthouseCount < objGlobals.mCourthouseMax) {
        objGlobals.mCountGold -= objGlobalsCost.mCourthouse;

        if(objGlobals.mCountGold < objGlobalsCost.mCourthouse) {
            document.getElementById("courthouse").style.color = "#838383";
            document.getElementById("courthouse").style.cursor = "default";
        }

        objGlobals.mCourthouseCount += 1;
        document.getElementById("courthouses").innerHTML = objGlobals.mCourthouseCount;

        //reduce corruption
        objGlobals.mCorruptionOffset -= (3 * objGlobals.mLandMultiplier);

        //increment price per additional land
        objGlobalsCost.mCourthouse *= (1.1 + (0.05 * objGlobals.mLandCount));
        objGlobalsCost.mCourthouse = objGlobalsCost.mCourthouse.toFixed();
        var cost = checkThousands(objGlobalsCost.mCourthouse);
        document.getElementById("courthouseCost").innerHTML = cost;

    } else if(el.id ==="land" && objGlobals.mCountGold >= objGlobalsCost.mLand && objGlobals.mLandCount < objGlobals.mLandMax && objGlobals.mBlnTripped) {
        objGlobals.mCountGold -= objGlobalsCost.mLand;

        if(objGlobals.mCountGold < objGlobalsCost.mLand) {
            document.getElementById("land").style.color = "#838383";
            document.getElementById("land").style.cursor = "default";
        }

        objGlobals.mLandCount += 1;
        document.getElementById("lands").innerHTML = objGlobals.mLandCount;

        //increase maximum allowable buildings
        objGlobals.mMarketMax += 10;
        document.getElementById("marketMax").innerHTML = objGlobals.mMarketMax;
        objGlobals.mTradingPostMax += 10;
        document.getElementById("tradingPostMax").innerHTML = objGlobals.mTradingPostMax;
        objGlobals.mFactoryMax += 5;
        document.getElementById("factoryMax").innerHTML = objGlobals.mFactoryMax;
        objGlobals.mRecyclingMax += 5;
        document.getElementById("recyclingMax").innerHTML = objGlobals.mRecyclingMax;
        objGlobals.mBankMax += 5;
        document.getElementById("bankMax").innerHTML = objGlobals.mBankMax;
        objGlobals.mStockmarketMax += 1;
        document.getElementById("stockmarketMax").innerHTML = objGlobals.mStockmarketMax;
        objGlobals.mCourthouseMax += 5;
        document.getElementById("courthouseMax").innerHTML = objGlobals.mCourthouseMax;

        //increase building output multiplier
        objGlobals.mLandMultiplier *= 1.3;

        //increase building and burn amount labels
        document.getElementById("market").title = "+" + (0.1 * objGlobals.mLandMultiplier).toFixed(1) + " gold / sec";
        document.getElementById("tradingPost").title = "+" + (0.5 * objGlobals.mLandMultiplier).toFixed(1) + " gold / sec";
        document.getElementById("bank").title = "+" + (3 * objGlobals.mLandMultiplier).toFixed(1) + " gold / sec";
        document.getElementById("stockMarket").title = "+" + (60 * objGlobals.mLandMultiplier).toFixed(0) + " gold / sec";
        document.getElementById("courthouse").title = "-" + (3 * objGlobals.mLandMultiplier).toFixed(0) + " gold / sec corruption";

        //check to enable Wall Street and International Trade
        if(objGlobals.mLandCount ===3) {
            document.getElementById("market").classList.add("hidden");
            document.getElementById("tradingPost").classList.add("hidden");
            document.getElementById("bank").classList.add("hidden");
            document.getElementById("stockMarket").classList.add("hidden");
            document.getElementById("wallStreet").classList.remove("hidden");
            document.getElementById("trade").classList.remove("hidden");
        }

        //reduce corruption and decay
        objGlobals.mCorruptionLandOffset -= 20;
        objGlobals.mDecayLandOffset -= 70;

        //increase subsequent land cost
        objGlobalsCost.mLand *= (1.1 + (0.1 * objGlobals.mLandCount));
        objGlobalsCost.mLand = objGlobalsCost.mLand.toFixed();
        var cost = checkThousands(objGlobalsCost.mLand);
        document.getElementById("landCost").innerHTML = cost;
        

    } else if(el.id ==="ai" && objGlobals.mCountGold >= objGlobalsCost.mAi && objGlobals.mAICount < 1) {
        objGlobals.mCountGold = objGlobals.mCountGold-objGlobalsCost.mAi;

        if(objGlobals.mCountGold < objGlobalsCost.mAi) {
            document.getElementById("ai").style.color = "#838383";
            document.getElementById("ai").style.cursor = "default";
        }

        objGlobals.mAICount += 1;
        document.getElementById("ais").innerHTML = objGlobals.mAICount;

        objGlobals.mGoldRate += 1000;
    }

    if(objGlobals.mCountGold < 10000) {
        document.getElementById("countGold").innerHTML = Math.floor(objGlobals.mCountGold);
    } else if (objGlobals.mGoldRate < 100) {
        document.getElementById("countGold").innerHTML = (objGlobals.mCountGold/10000).toFixed(1) + "k";
    }
}

function upgrade(el) {
    if(el.id === "pick_shovel" && objGlobals.mCountGold >= 150 && objGlobals.mBlnPickAvailable) {
        objGlobals.mCountGold = objGlobals.mCountGold-150;
        
        if(objGlobals.mCountGold < 150) {
            document.getElementById("pick_shovel").style.color = "#838383";
            document.getElementById("pick_shovel").style.cursor = "default";
        }

        objGlobals.mPick_ShovelCount += 1;
        document.getElementById("pick_shovels").innerHTML = objGlobals.mPick_ShovelCount;

        objGlobals.mIncrement = objGlobals.mIncrement * 2;
        objGlobals.mBlnPickAvailable = false;
        document.getElementById("perClick").innerHTML = objGlobals.mIncrement;
    } else if(el.id === "worker" && objGlobals.mCountGold >= 500 && objGlobals.mBlnWorkersAvailable) {
        objGlobals.mCountGold = objGlobals.mCountGold-500;
        
        if(objGlobals.mCountGold < 500) {
            document.getElementById("worker").style.color = "#838383";
            document.getElementById("worker").style.cursor = "default";
        }

        objGlobals.mWorkerCount += 1;
        document.getElementById("workers").innerHTML = objGlobals.mWorkerCount;

        objGlobals.mIncrement = objGlobals.mIncrement * 2;
        objGlobals.mBlnWorkersAvailable = false;
        document.getElementById("perClick").innerHTML = objGlobals.mIncrement;
    } else if(el.id === "caffeine" && objGlobals.mCountGold >= 1000 && objGlobals.mBlnCaffeineAvailable) {
        objGlobals.mCountGold = objGlobals.mCountGold-1000;
        
        if(objGlobals.mCountGold < 1000) {
            document.getElementById("caffeine").style.color = "#838383";
            document.getElementById("caffeine").style.cursor = "default";
        }

        objGlobals.mCaffeineCount += 1;
        document.getElementById("caffeines").innerHTML = objGlobals.mCaffeineCount;

        objGlobals.mIncrement = objGlobals.mIncrement * 2;
        objGlobals.mBlnCaffeineAvailable = false;
        document.getElementById("perClick").innerHTML = objGlobals.mIncrement;
    } else if(el.id === "tnt" && objGlobals.mCountGold >= 2000 && objGlobals.mBlnTNTAvailable) {
        objGlobals.mCountGold = objGlobals.mCountGold-2000;
        
        if(objGlobals.mCountGold < 2000) {
            document.getElementById("tnt").style.color = "#838383";
            document.getElementById("tnt").style.cursor = "default";
        }

        objGlobals.mTNTCount += 1;
        document.getElementById("tnts").innerHTML = objGlobals.mTNTCount;

        objGlobals.mIncrement = objGlobals.mIncrement * 2;
        objGlobals.mBlnTNTAvailable = false;
        document.getElementById("perClick").innerHTML = objGlobals.mIncrement;
    } else if(el.id === "dragline" && objGlobals.mCountGold >= 10000 && objGlobals.mBlnDraglineAvailable) {
        objGlobals.mCountGold = objGlobals.mCountGold-10000;
        
        if(objGlobals.mCountGold < 10000) {
            document.getElementById("dragline").style.color = "#838383";
            document.getElementById("dragline").style.cursor = "default";
        }

        objGlobals.mDraglinesCount += 1;
        document.getElementById("draglines").innerHTML = objGlobals.mDraglinesCount;

        objGlobals.mIncrement = objGlobals.mIncrement * 2;
        objGlobals.mBlnDraglineAvailable = false;
        document.getElementById("perClick").innerHTML = objGlobals.mIncrement;

    } else if(el.id === "mine" && objGlobals.mLandCount > 0 &&  objGlobals.mBlnMineAvailable) {

        document.getElementById("mine").style.color = "#838383";
        document.getElementById("mine").style.cursor = "default";

        objGlobals.mMinesCount += 1;
        document.getElementById("mines").innerHTML = "1";

        objGlobals.mIncrement = objGlobals.mIncrement * 3;
        objGlobals.mBlnMineAvailable = false;
        document.getElementById("perClick").innerHTML = objGlobals.mIncrement;

    } else if(el.id === "automated" && objGlobals.mAICount === 1 &&  objGlobals.mBlnAutomatedAvailable) {
        document.getElementById("automated").style.color = "#838383";
        document.getElementById("automated").style.cursor = "default";

        objGlobals.mAutomatedCount += 1;
        document.getElementById("automateds").innerHTML = "1";

        objGlobals.mIncrement = objGlobals.mIncrement * 5;
        objGlobals.mBlnAutomatedAvailable = false;
        document.getElementById("perClick").innerHTML = objGlobals.mIncrement;
    }
}

function incrementMachines(rate) {
    objGlobals.mMachines += rate;

    if(objGlobals.mMachines < 99.8) {
        document.getElementById("countMachines").innerHTML = objGlobals.mMachines.toFixed(1);
    } else {
        document.getElementById("countMachines").innerHTML = objGlobals.mMachines.toFixed(0);
    }
    
    //increase productivity
    objGlobals.mGoldRate += 11 * rate;  //rate = (fractions of) machines/sec
}

function incrementPollution(rate) { // called once per second
    objGlobals.mPollutionCount += rate; //rate = per second
    var pollution = objGlobals.mPollutionCount;
    pollution < 0 ? pollution = 0 : true;

    if(objGlobals.mPollutionCount < 99.8) {
        document.getElementById("countPollution").innerHTML = pollution.toFixed(1);
    } else {
        document.getElementById("countPollution").innerHTML = pollution.toFixed(0);
    }

    //decrease productivity
    objGlobals.mGoldRate -= objGlobals.mPollutionGold * rate;  //rate = (fractions of) pollution/sec
    objGlobals.mGoldRate < 0 ? objGlobals.mGoldRate = 0.000001 : true;
}

function corruption_decay_interest() {    
    const rate = objGlobals.mGoldRate;  // per second

    //interest
    let interest = (objGlobals.mCountGold * INTEREST_RATE * (CDI_INTERVAL/1000));   //INTEREST_RATE is per second, therefore adjust for CDI_INTERVAL
    interest > (100 * (CDI_INTERVAL/1000)) ? interest = (100 * (CDI_INTERVAL/1000)) : true;

    if((interest * (1000/CDI_INTERVAL)) < 0.05 ) {
        document.getElementById("interest").innerHTML = (interest * (1000/CDI_INTERVAL)).toFixed(0);  //display interest as per second
    } else {
        document.getElementById("interest").innerHTML = (interest * (1000/CDI_INTERVAL)).toFixed(1);
    }

    //corruption
    let corruption = objGlobals.mCountWorth/2000 + objGlobals.mCorruptionOffset;
    corruption += objGlobals.mCorruptionLandOffset;
    corruption < 0 ? corruptionRate = 0 : true;
    objGlobals.mCorruption = corruption;
    
    if(corruption < 0.9) {
        document.getElementById("corruption").innerHTML =  "0";
    } else {
        document.getElementById("corruption").innerHTML = "-" + corruption.toFixed(0);  //display per second rate
    } 

    //decay (wear and tear).
    var now = Date.now();
    var secElapsed = (now - objGlobals.msStartTime - objGlobals.mTimeOffset)/1000;

    decayRate = (Math.pow(secElapsed, 1.15)-1850)/2;
    decayRate += objGlobals.mDecayOffset;
    decayRate += objGlobals.mDecayLandOffset;
    decayRate < 0 ? decayRate = 0 : true;
    objGlobals.mDecayRate = decayRate;

    var decay = document.getElementById("decay");

    if(decayRate === 0) {
        decay.innerHTML = decayRate.toFixed(0);
    } else {
        decay.innerHTML = "-" + decayRate.toFixed(0);
    }

    let goldRate = rate + interest - corruption - decayRate;
    goldRate < 0 ? goldRate = 0.001 : true;

    incrementGold((goldRate * CDI_INTERVAL/1000));

    document.getElementById("goldRate").innerHTML = goldRate.toFixed(1);
}

function incrementGold(goldRate) {
    objGlobals.mCountGold += goldRate;

    if(objGlobals.mCountGold < 10000) {
        document.getElementById("countGold").innerHTML = Math.floor(objGlobals.mCountGold);
    } else {
        document.getElementById("countGold").innerHTML = (objGlobals.mCountGold/1000).toFixed(1) + "k";
    }

    incrementWorth(goldRate);
}

function incrementWorth(amount) {
    objGlobals.mCountWorth +=amount;
    document.getElementById("countWorth").innerHTML = objGlobals.mCountWorth.toFixed(0);

    if (objGlobals.mCountWorth >= 90000 && objGlobals.mCountWorth <= 90032) {
        objGlobals.mBlnTripped = true;
    }
}

function growthRate() {
    var now = Date.now();
    
    var secElapsed = (now - objGlobals.msStartTime - objGlobals.mTimeOffset)/1000;
    var growthRate = objGlobals.mCountWorth/secElapsed;
    document.getElementById("growthRate").innerHTML = growthRate.toFixed(1);

    if(growthRate > objGlobals.mRecordRate) {
        objGlobals.mRecordRate = growthRate;
        document.getElementById("growthRecord").innerHTML = growthRate.toFixed(1);
    }
}

function gameClock() { //includes button enables
    //tick game clock
    var now = Date.now();
    secElapsed = (now - objGlobals.msStartTime - objGlobals.mTimeOffset)/1000;
    secElapsed = secElapsed.toFixed(0);
    document.getElementById("time").innerHTML = secElapsed;

    if(objGlobals.mCorruption >= mCorruptionBurn) {
        document.getElementById("burnCorruption").disabled = false;
    } else {
        document.getElementById("burnCorruption").disabled = true;
    }

    if(objGlobals.mDecayRate >= mDecayBurn) {
        document.getElementById("burnDecay").disabled = false;      
    } else {
        document.getElementById("burnDecay").disabled = true;   
    } 
}

function burnCorruption() {
    objGlobals.mSteemBurnt += 0.1;
    document.getElementById("steem").innerHTML = objGlobals.mSteemBurnt.toFixed(1);
    objGlobals.mCorruptionOffset -= mCorruptionBurn;
}

function burnDecay() {
    objGlobals.mSteemBurnt += 0.1;
    document.getElementById("steem").innerHTML = objGlobals.mSteemBurnt.toFixed(1);
    objGlobals.mDecayOffset -= mDecayBurn;
}

function pause(el) {
    if(objGlobals.mCountWorth > 0) {
        objGlobals.mBlnPaused = true;
    }

    if(objGlobals.msStartTime === 0) {
        //game not started yet, therefore don't pause
        return false;
    }

    if(el.value === "Pause") {
        for(let id of objGlobals.mArrIntervalIDs) {
            clearInterval(id);
        }

        clearInterval(objGlobals.mMachineInterval);
        clearInterval(objGlobals.mPollutionInterval);
        bonuses();  // clears any pending bonus setTimeouts

        objGlobals.msPauseTime = Date.now();
        el.value = "Resume";
    } else {
        resume();
        el.value = "Pause";
    }
}

function resume() {
    objGlobals.msRestartTime = Date.now();
    objGlobals.mTimeOffset += objGlobals.msRestartTime - objGlobals.msPauseTime;

    objGlobals.mBlnPaused = false;

    startIntervals();

    //start machine creation intervals
    objGlobals.mMachineInterval = setInterval(incrementMachines, 1000, objGlobals.mMachineRate);

    //start pollution creating intervals.
    objGlobals.mPollutionInterval = setInterval(incrementPollution, 1000, objGlobals.mPollutionRate);

    //start bonuses again
    bonuses();

    document.getElementById("save").disabled = false;
}

function save(el) {
    pause(document.getElementById("pause"));
    el.disabled =  true;
    window.localStorage.setItem("_globals", JSON.stringify(objGlobals));
    window.localStorage.setItem("_globalsCost", JSON.stringify(objGlobalsCost));
}

function load() {
    objGlobals = JSON.parse(localStorage.getItem("_globals"));
    objGlobalsCost = JSON.parse(localStorage.getItem("_globalsCost"));

    document.getElementById("growthRecord").innerHTML = objGlobals.mRecordRate.toFixed(1);

    //set building displays
    document.getElementById("markets").innerHTML = objGlobals.mMarketCount;
    document.getElementById("marketMax").innerHTML = objGlobals.mMarketMax;
    var marketCost = checkThousands(objGlobalsCost.mMarket);
    document.getElementById("marketCost").innerHTML = marketCost;

    document.getElementById("tradingPosts").innerHTML = objGlobals.mTradingPostCount;
    document.getElementById("tradingPostMax").innerHTML = objGlobals.mTradingPostMax;
    var tradingCost = checkThousands(objGlobalsCost.mMarket);
    document.getElementById("tradingPostCost").innerHTML = tradingCost;

    document.getElementById("banks").innerHTML = objGlobals.mBankCount;
    document.getElementById("bankMax").innerHTML = objGlobals.mBankMax;
    var bankCost = checkThousands(objGlobalsCost.mBank);
    document.getElementById("bankCost").innerHTML = bankCost;

    document.getElementById("stockmarkets").innerHTML = objGlobals.mStockmarketCount;
    document.getElementById("stockmarketMax").innerHTML = objGlobals.mStockmarketMax;
    var stockmarketCost = checkThousands(objGlobalsCost.mStockmarket);
    document.getElementById("stockmarketCost").innerHTML = stockmarketCost;

    document.getElementById("wallStreets").innerHTML = objGlobals.mWallStreetCount;

    document.getElementById("trades").innerHTML = objGlobals.mTradeCount;

    document.getElementById("factories").innerHTML = objGlobals.mFactoryCount;
    document.getElementById("factoryMax").innerHTML = objGlobals.mFactoryMax;
    var factoryCost = checkThousands(objGlobalsCost.mFactory);
    document.getElementById("factoryCost").innerHTML = factoryCost;

    document.getElementById("recyclingCentres").innerHTML = objGlobals.mRecyclingCount;
    document.getElementById("recyclingMax").innerHTML = objGlobals.mRecyclingMax;
    var recyclingCost = checkThousands(objGlobalsCost.mRecycling);
    document.getElementById("recyclingCost").innerHTML = recyclingCost;

    document.getElementById("courthouses").innerHTML = objGlobals.mCourhouseCount;
    document.getElementById("courthouseMax").innerHTML = objGlobals.mCourthouseMax;
    var courthouseCost = checkThousands(objGlobalsCost.mCourthouse);
    document.getElementById("courthouseCost").innerHTML = courthouseCost;

    document.getElementById("lands").innerHTML = objGlobals.mLandCount;
    document.getElementById("landMax").innerHTML = objGlobals.mLandMax;
    var landCost = checkThousands(objGlobalsCost.mLand);
    document.getElementById("landCost").innerHTML = landCost;

    document.getElementById("ais").innerHTML = objGlobals.mAICount;

    //set upgrade displays
    document.getElementById("pick_shovels").innerHTML = objGlobals.mPick_ShovelCount;
    document.getElementById("workers").innerHTML = objGlobals.mWorkerCount;
    document.getElementById("caffeines").innerHTML = objGlobals.mCaffeineCount;
    document.getElementById("tnts").innerHTML = objGlobals.mTNTCount;
    document.getElementById("draglines").innerHTML = objGlobals.mDraglinesCount;
    document.getElementById("mines").innerHTML = objGlobals.mMinesCount;
    document.getElementById("automateds").innerHTML = objGlobals.mAutomatedCount;

    resume();
    growthRate();
}

function enableBuildings() {
    var nodes = document.getElementsByClassName("items");

    for (let node of nodes) {
        for (let key of Object.keys(objGlobalsCost)) {
            if (node.dataset.variable == key) {   //eg. if node.dataset.variable == "mMarket"
                if(objGlobals.mCountGold >= objGlobalsCost[key] && objGlobals[key + "Count"] < objGlobals[key + "Max"]) {
                    node.classList.remove("disabled");
                } else {
                    node.classList.add("disabled");
                }
                break;
            }
        }
    }

    //need something here for open-cut and automated mine
}

function checkThousands(int) {
    return int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function scaleUp(el) {
    el.style.transform = "scale(1.03,1.03)";
}

function scaleDown(el) {
    el.style.transform = "scale(1,1)";
    
}