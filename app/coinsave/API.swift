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

    // MARK: - Internal

    internal func createGetRequest(url: URL) throws -> URLRequest {
        print(url.absoluteString)
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "accept")
        request.setValue("application/json", forHTTPHeaderField: "content-type")
        return request
    }
}
