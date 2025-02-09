//
//  UserStore.swift
//  coinsave
//
//  Created by Jann Driessen on 08.02.25.
//

import SwiftUI

class UserStore {
    static let accountKey = "com.coinsave.account"

    static var accountAddress: String {
        get {
            Config.testAccount ?? UserDefaults.standard.string(forKey: accountKey)!
        }
        set {
            UserDefaults.standard.set(newValue, forKey: accountKey)
            UserDefaults.standard.synchronize()
        }
    }
}
