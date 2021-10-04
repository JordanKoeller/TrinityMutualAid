import { expect } from "chai";
import { HelloHandler } from "../../src/handlers/articles"
import { ApiGatewayEventMock } from "../mocks/apigateway-event-mock";


describe("Test Hello world", () => {
  it('it runs', () => {
    const app = new HelloHandler();
    const evt = new ApiGatewayEventMock();
    evt.httpMethod = 'GET';
    evt.path = '/hello';
    expect(app.isHandler(evt)).to.equal(true);
  })
})