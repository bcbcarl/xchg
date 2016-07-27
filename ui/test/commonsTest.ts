/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/globals/es6-shim/index.d.ts" />

import { formatNumber } from "../src/commons";

let expect = chai.expect;

describe("common function", () => {
    describe("formatNumber", () => {
        it("has as much number of digits after the dot as the parameter for positive integer", () => {
            expect(formatNumber(1, 2)).to.equal("1.00");
        });
        it("handles negative integer correctly", () => {
            expect(formatNumber(-1, 2)).to.equal("-1.00");
        });
        it("handles zero correctly", () => {
            expect(formatNumber(0, 4)).to.equal("0.0000");
        });
        it("cuts positive float number correctly", () => {
            expect(formatNumber(0.11111, 4)).to.equal("0.1111");
        });
        it("cuts negative float number correctly", () => {
            expect(formatNumber(-0.11111, 4)).to.equal("-0.1111");
        });
        it("pads positive float number correctly", () => {
            expect(formatNumber(0.11, 4)).to.equal("0.1100");
        });
        it("pads negative float number correctly", () => {
            expect(formatNumber(-0.11, 4)).to.equal("-0.1100");
        });
        it("returns zero if value is not a number", () => {
            // 規避 typescript 檢查
            let str: any = "abc";
            expect(formatNumber(str as number, 4)).to.equal("0.0000");
        });
    });
});