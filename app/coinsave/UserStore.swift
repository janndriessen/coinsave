//
//  UserStore.swift
//  coinsave
//
//  Created by Jann Driessen on 08.02.25.
//

import SwiftUI

class UserStore {
    @AppStorage("account") private var account: String = ""

    static var accountAddress: String {
        get { UserStore().account }
        set {
            UserStore().account = newValue
        }
    }
}
