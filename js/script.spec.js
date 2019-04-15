const { createAbvParameter, createBeerContainer, createNameContainer, createEndpoint, createImgContainer, createTagContainer, appendData } = require("./script.js");

const { JSDOM } = require("jsdom")
const dom = new JSDOM();
global.document = dom.window.document;

describe("Beer display module", () => {
    
    test("1 to be 1", () => {
        expect(1).toBe(1)
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
        const beerContainer = global.document.createElement('div');
    
        createNameContainer(beer, beerContainer);
    
        expect(beerContainer.innerHTML.toString().includes(beer.name)).toBeTruthy();
    })

    test("createEndpoint returns expected text when no params included", () => {
        const result = createEndpoint();

        expect(result).toBe("https://api.punkapi.com/v2/beers?page=1&per_page=15");
    })
    
    test(`createEndpoint returns expected text when "&abv_lt=4" passed as param`, () => {
        const result = createEndpoint("&abv_lt=4");

        expect(result).toBe("https://api.punkapi.com/v2/beers?page=1&per_page=15&abv_lt=4");
    })

    test("createImgContainer extends beerContainer with url for image", () => {
        const beer = { image_url: "image_url_expected" };
        const beerContainer = global.document.createElement('div');

        createImgContainer(beer, beerContainer);

        expect(beerContainer.innerHTML.toString().includes(beer.image_url)).toBeTruthy();
        expect(beerContainer.innerHTML.toString().includes('imgContainer')).toBeTruthy();
    })

    test("createTagContainer displays beer property text in dom element passed as parameter", () => {
        const beer = { tagline: "taglineExpected" };
        const beerContainer = global.document.createElement('div');

        createTagContainer(beer, beerContainer);

        expect(beerContainer.innerHTML.toString().includes(beer.tagline)).toBeTruthy();
        expect(beerContainer.innerHTML.toString().includes('beerTag')).toBeTruthy();
    })

    test("appendData adds beerContainer with filled values to body", () => {
        document.body.innerHTML =
        '<div>' +
        '  <div id="beersContainer" /></div>' +
        '</div>';

        appendData([{name: "abc", tagline: "def", image_url: "ghi" }]);

        expect(document.body.innerHTML.toString()).toBe("<div>  <div id=\"beersContainer\"><div class=\"beerContainer container col-12 col-sm-6 col-md-4 col-lg-3\"><div class=\"nameContainer container\"><span class=\"beerName\">abc</span></div><div class=\"imgContainer container\" style=\"background-image: url(ghi);\"></div><div class=\"tagContainer container\"><span class=\"beerTag\">def</span></div></div></div></div>")
    })
});