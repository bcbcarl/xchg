package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"testing"

	"git.ronmi.tw/ronmi/sdm"

	"github.com/Patrolavia/jsonapi"
)

func makeList(preset []Order) (*list, string, *sdm.Manager) {
	mgr, err := initDB(preset)
	if err != nil {
		log.Fatalf("Cannot initial database: %s", err)
	}
	fake := FakeAuthenticator("123456")
	token, _ := fake.Token("123456")
	return &list{mgr, fake}, token, mgr
}

func TestList(t *testing.T) {
	presetUSD := []Order{
		Order{1468248039, 100, -100, "USD"},
		Order{1468248040, -50, 51, "USD"},
	}
	h, token, mgr := makeList(presetUSD)
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(jsonapi.APIHandler(h.Handle).Handler).Post(
		"/api/list",
		"",
		`{"code":"USD","token":"`+token+`"}`,
	)

	if err != nil {
		t.Fatalf("unexpected error occured when testing list: %s", err)
	}

	if resp.Code != http.StatusOK {
		t.Fatalf("unexpected error occured when testing list with status code %d: %s", resp.Code, resp.Body.String())
	}

	var orders []Order
	if resp.Body == nil {
		t.Fatal(resp)
	}
	if err := json.Unmarshal(resp.Body.Bytes(), &orders); err != nil {
		t.Fatalf("cannot encode returned data from list: %s", err)
	}

	msgs := validateOrders(presetUSD, orders)
	for _, msg := range msgs {
		t.Errorf("list: %s", msg)
	}
}

func TestListEmpty(t *testing.T) {
	h, token, mgr := makeList([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(jsonapi.APIHandler(h.Handle).Handler).Post("/api/list", "", `{"code":"NTD","token":"`+token+`"}`)

	if err != nil {
		t.Fatalf("unexpected error occured when testing list: %s", err)
	}

	if resp.Code != http.StatusOK {
		t.Fatalf("unexpected error occured when testing list with status code %d: %s", resp.Code, resp.Body.String())
	}

	if resp.Body == nil {
		t.Fatal(resp)
	}
	if str := strings.TrimSpace(resp.Body.String()); str != "[]" {
		t.Errorf("list: not returning empty array: '%s'", str)
	}
}

func TestListNoData(t *testing.T) {
	h, token, mgr := makeList([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(jsonapi.APIHandler(h.Handle).Handler).Post("/api/list", "", `{"token":"`+token+`"}`)

	if err != nil {
		t.Fatalf("unexpected error occured when testing list: %s", err)
	}

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("unexpected status code %d for bad request: %s", resp.Code, resp.Body.String())
	}
}

func TestListNotJSON(t *testing.T) {
	h, _, mgr := makeList([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(jsonapi.APIHandler(h.Handle).Handler).Post("/api/list", "", ``)

	if err != nil {
		t.Fatalf("unexpected error occured when testing list: %s", err)
	}

	if resp.Code != http.StatusBadRequest {
		t.Fatalf("unexpected status code %d for bad request: %s", resp.Code, resp.Body.String())
	}
}

func TestListWrongToken(t *testing.T) {
	h, _, mgr := makeList([]Order{})
	defer mgr.Connection().Close()

	resp, err := jsonapi.HandlerTest(jsonapi.APIHandler(h.Handle).Handler).Post(
		"/api/list",
		"",
		`{"code":"USD","token":"1234"}`,
	)

	if err != nil {
		t.Fatalf("unexpected error occured when testing list: %s", err)
	}

	if resp.Code != http.StatusForbidden {
		t.Fatalf("unexpected status code %d for forbidden: %s", resp.Code, resp.Body.String())
	}
}
