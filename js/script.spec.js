const createAbvParameter = require("./script.js").__get__('createAbvParameter');
const createBeerContainer = require("./script.js").__get__('createBeerContainer');
const createEndpoint = require("./script.js").__get__('createEndpoint');
const createTagContainer = require("./script.js").__get__('createTagContainer');
const createNameContainer = require("./script.js").__get__('createNameContainer');
const createImgContainer =  require("./script.js").__get__('createImgContainer');
const appendData = require("./script.js").__get__('appendData');
const loadOnStart = require("./script.js").__get__('loadOnStart');
const { __RewireAPI__: beerDisplay } = require('./script.js');

let beerContainer;

const { JSDOM } = require("jsdom")
const dom = new JSDOM();
global.document = dom.window.document;

describe("Beer display module", () => {

    beforeEach(() => {
        document.body.innerHTML =
        '<div>' +
        '  <div id="beersContainer" /></div>' +
        '</div>';

        beerContainer = global.document.createElement('div');
    })

    test("createAbvParmeter with option 1 returns expected text", () => {
        const result = createAbvParameter(1);
        
        expect(result).toBe("&abv_lt=4")

    })

    test("createAbvParmeter with option 2 returns expected text", () => {
        const result = createAbvParameter(2);
        
        expect(result).toBe("&abv_lt=6&abv_gt=4");

    })

    test("createAbvParmeter with option 3 returns expected text", () => {
        const result = createAbvParameter(3);
        
        expect(result).toBe("&abv_gt=6");

    })

    
    test("createAbvParmeter with option 0 returns expected false", () => {
        const result = createAbvParameter(0);
        
        expect(result).toBeFalsy();

    })

    test("createBeerContainer returs div element with class selectors", () => {
        const result = createBeerContainer();

        expect(result.nodeName).toBe("DIV");

        expect(result.classList.contains("beerContainer")).toBeTruthy();
    })

    test("createNameContainer displays beer property text in dom element passed as parameter", () => {
        const beer = { name: "PiwoPiwo" };
    
        createNameContainer(beer, beerContainer);
    
        expect(beerContainer.innerHTML.toString().includes(beer.name)).toBeTruthy();
    })

    test("createEndpoint returns expected text when no params included", () => {
        const result = createEndpoint();

        expect(result).toBe("https://api.punkapi.com/v2/beers?page=1&per_page=15");
    })

    test('createEndpoint when pageCounter changes returns address with proper pagination', () => {
        const revert = beerDisplay.__Rewire__('pageCounter', 2);


        const abvParam = "&abv_lt=4";
        const result = createEndpoint(abvParam);

        revert();

        expect(result).toBe('https://api.punkapi.com/v2/beers?page=2&per_page=15'+abvParam)
    })

        
    test(`createEndpoint returns expected text when "&abv_lt=4" passed as param`, () => {
        const result = createEndpoint("&abv_lt=4");

        expect(result).toBe("https://api.punkapi.com/v2/beers?page=1&per_page=15&abv_lt=4");
    })

    test("createImgContainer extends beerContainer with url for image", () => {
        const beer = { image_url: "image_url_expected" };       

        createImgContainer(beer, beerContainer);

        expect(beerContainer.innerHTML.toString().includes(beer.image_url)).toBeTruthy();
        expect(beerContainer.innerHTML.toString().includes('imgContainer')).toBeTruthy();
    })

    test("createTagContainer displays beer property text in dom element passed as parameter", () => {
        const beer = { tagline: "taglineExpected" };

        createTagContainer(beer, beerContainer);

        expect(beerContainer.innerHTML.toString().includes(beer.tagline)).toBeTruthy();
        expect(beerContainer.innerHTML.toString().includes('beerTag')).toBeTruthy();
    })

    test("appendData adds beerContainer with filled values to body", () => {
        appendData([{name: "abc", tagline: "def", image_url: "ghi" }]);

        expect(document.body.innerHTML.toString()).toBe("<div>  <div id=\"beersContainer\"><div class=\"beerContainer container col-12 col-sm-6 col-md-4 col-lg-3\"><div class=\"nameContainer container\"><span class=\"beerName\">abc</span></div><div class=\"imgContainer container\" style=\"background-image: url(ghi);\"></div><div class=\"tagContainer container\"><span class=\"beerTag\">def</span></div></div></div></div>")
    })

    test("appendData for every argument calls createBeerContainer, createNameContainer, createImgContainer, createTagContainer", () => {
        const mockCallback = jest.fn(() => global.document.createElement('div'));

        beerDisplay.__Rewire__('createBeerContainer', mockCallback);
        beerDisplay.__Rewire__('createNameContainer', mockCallback);
        beerDisplay.__Rewire__('createImgContainer', mockCallback);
        beerDisplay.__Rewire__('createTagContainer', mockCallback);

        appendData([{}]);

        expect(mockCallback.mock.calls.length).toBe(4);
    })

    test("loadOnStart calls loadBeers", () => {
        const mockCallback = jest.fn();

        const revert = beerDisplay.__Rewire__('loadBeers', mockCallback);

        loadOnStart();

        revert();

        expect(mockCallback.mock.calls.length).toBe(1);
    })

    test("loadOnStart adds loadNextPageOnScrollBottom to scroll", () => {
        const mockCallback = jest.fn();
        const revertLoadNextPageOnScrollBottom = beerDisplay.__Rewire__('loadNextPageOnScrollBottom', mockCallback);
        const revertLoadBeers = beerDisplay.__Rewire__('loadBeers', jest.fn());

        loadOnStart();

        const event = document.createEvent("UIEvents");
        event.initUIEvent("scroll", true, true, window, 1);
        document.dispatchEvent(event);

        revertLoadNextPageOnScrollBottom();
        revertLoadBeers();

        expect(mockCallback.mock.calls.length).toBe(1);
    })

});