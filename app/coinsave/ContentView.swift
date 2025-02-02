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
                ZStack {
                    CSColor.white.edgesIgnoringSafeArea(.all)
                    VStack {
                        Spacer()
                        Text("coinsave")
                            .foregroundStyle(CSColor.darkGray)
                            .font(.system(size: 36))
                            .bold()
                        Spacer()
                        Button(action: {
                            Task.init {
                                try? await Task.sleep(nanoseconds: 2_500_000_000)
                                withAnimation(.easeIn) {
                                    shouldTransition = true
                                }
                            }
                        }) {
                            Text("create")
                                .fontWeight(.bold)
                                .padding()
                                .frame(width: 150, height: 60)
                                .background(CSColor.blue)
                                .foregroundColor(.white)
                                .cornerRadius(30)
                                .scaleEffect(1.0)
                                .shadow(color: .gray.opacity(0.5), radius: 10, x: 5, y: 5)
                        }
                        .buttonStyle(PlainButtonStyle())
                        
                    }
                    .padding()
                }
            }
        }
        .onAppear {
//            Timer.scheduledTimer(withTimeInterval: 2.5, repeats: false) { _ in
//                withAnimation(.easeIn) {
//                    shouldTransition = true
//                }
//            }
        }
    }
}

#Preview {
    ContentView()
}
