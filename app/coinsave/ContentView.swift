//
//  ContentView.swift
//  coinsave
//
//  Created by Jann Driessen on 31.01.25.
//

import SwiftUI

struct ContentView: View {
    @State private var shouldTransition = false
    var body: some View {
        VStack {
            if shouldTransition {
                Dash()
                    .transition(.opacity)
            } else {
                Launch(shouldTransition: $shouldTransition)
            }
        }
    }
}

#Preview {
    ContentView()
}
