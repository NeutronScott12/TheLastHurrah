package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
	"time"
)

var wg sync.WaitGroup

type QueryRequestBody struct {
	Query string `json:"query"`
}

func make_request () {
	var query = QueryRequestBody{
		Query: `query {
			fetch_users {
			  email,
			  confirmed
			  two_factor_authentication
			  id
			  avatar {
				created_at
			  }
			  blocked_users {
				email
			  }
			}
		  }`,
	}

	jsonStr, err := json.Marshal(query)

	if err != nil {
		panic(err)
	}

	request, err := http.NewRequest(
		"POST",
		"http://localhost:4000/graphql", 
		bytes.NewBuffer(jsonStr),
	)

	if err != nil {
		panic(err)
	}

	request.Header.Add("content-type", "application/json")
	request.Header.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzE1N2YzZGItM2E3OS00M2UwLWEzZmUtMDc2OGExZGM4NmJiIiwidXNlcm5hbWUiOiJzY290dCIsImVtYWlsIjoic2NvdHRiZXJyeTkxQGdtYWlsLmNvbSIsImNvbmZpcm1lZCI6dHJ1ZSwiaWF0IjoxNjU3MDM2NDQ3LCJleHAiOjE2NTc2NDEyNDd9.gq88uN2VbXfLkvsCOz_ErU1Ii6tIaioOQHXVh2OQfs4")

	client := &http.Client{}
	response, err := client.Do(request)

	if err != nil {
		panic(err)
	}

	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)

	if err != nil {
		panic(err)
	}

	sb := string(body)

	fmt.Println("resp=", sb)
}

func main() {

	start := time.Now()
	for i := 0; i < 5000; i++ {
		println("iteration", i)
		go make_request()
	}
	wg.Wait()
	elapsed := time.Since(start)
	log.Printf("took %s", elapsed)
}