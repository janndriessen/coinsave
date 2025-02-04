//
//  API.swift
//  coinsave
//
//  Created by Jann Driessen on 03.02.25.
//

import BasedUtils
import BigInt
import Foundation

enum CSApiError: Error {
    case notFound
    case invalidConfig
    case unknown
}

class CSApi {

    internal let baseUrl: String = Config.baseUrl

    // MARK: - GET /balance

    struct BalanceResponse: Decodable {
        let account: String
        let symbol: String
        let decimals: Int
        let balance: String
    }

    func getBalance(for account: String) async throws -> String {
        guard let url = URL(string: "\(baseUrl)/balance?account=\(account)") else { throw CSApiError.invalidConfig }
        let request = try createGetRequest(url: url)
        let (data, res) = try await URLSession.shared.data(for: request)
        if let httpResponse = res as? HTTPURLResponse {
            let statusCode = httpResponse.statusCode
            print("error \(httpResponse.statusCode)")
            if statusCode == 404 {
                throw CSApiError.notFound
            }
            if statusCode < 200 || statusCode > 299 {
                print("Error fetching account data")
                throw CSApiError.unknown
            }
        }
        let balance = try JSONDecoder().decode(BalanceResponse.self, from: data)
        return "\(BasedUtils.formatUnits(BigInt(balance.balance) ?? BigInt(0), balance.decimals))"
    }

    // MARK: PUT /dca

    struct DcaConfig: Encodable {
        let account: String
        let inputAmount: String
    }

    func putDcaConfig(_ config: DcaConfig) async throws -> Bool {
        guard let url = URL(string: "\(baseUrl)/dca") else { throw CSApiError.invalidConfig }
        let request = try createPutRequest(url: url, params: config)
        let (_, res) = try await URLSession.shared.data(for: request)
        guard let httpResponse = res as? HTTPURLResponse else { return false}
        let statusCode = httpResponse.statusCode
        return !(statusCode < 200 || statusCode > 299)
    }

    // MARK: - POST /init

    struct AccountRequest: Encodable {}

    struct AccountResponse: Decodable {
        let account: String
    }

    func postInitAgent() async throws -> String {
        guard let url = URL(string: "\(baseUrl)/account") else { throw CSApiError.invalidConfig }
        let request = try createPostRequest(url: url, params: AccountRequest())
        let (data, res) = try await URLSession.shared.data(for: request)
        if let httpResponse = res as? HTTPURLResponse {
            let statusCode = httpResponse.statusCode
            print("error \(httpResponse.statusCode)")
            if statusCode == 404 {
                throw CSApiError.notFound
            }
            if statusCode < 200 || statusCode > 299 {
                print("Error fetching account data")
                throw CSApiError.unknown
            }
        }
        let json = try JSONDecoder().decode(AccountResponse.self, from: data)
        return json.account
    }

    // MARK: - Internal

    internal func createGetRequest(url: URL) throws -> URLRequest {
        print(url.absoluteString)
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "accept")
        request.setValue("application/json", forHTTPHeaderField: "content-type")
        return request
    }

    internal func createPutRequest<T: Encodable>(url: URL, params: T) throws -> URLRequest {
        print(url.absoluteString)
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "accept")
        request.setValue("application/json", forHTTPHeaderField: "content-type")
        request.httpBody = try JSONEncoder().encode(params)
        return request
    }

    internal func createPostRequest<T: Encodable>(url: URL, params: T) throws -> URLRequest {
        print(url.absoluteString)
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "accept")
        request.setValue("application/json", forHTTPHeaderField: "content-type")
        request.httpBody = try JSONEncoder().encode(params)
        return request
    }
}
