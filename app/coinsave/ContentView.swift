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
                // TODO:
                Text("Dashboard")
                    .transition(.opacity)
            } else {
                ZStack {
                    CSColor.white.edgesIgnoringSafeArea(.all)
                    VStack {
                        Text("coinsave")
                            .foregroundStyle(CSColor.darkGray)
                            .font(.system(size: 36))
                            .bold()
                    }
                    .padding()
                }
            }
        }
        .onAppear {
            Timer.scheduledTimer(withTimeInterval: 2.5, repeats: false) { _ in
                withAnimation(.easeIn) {
                    shouldTransition = true
                }
            }
        }
    }
}

#Preview {
    ContentView()
}
