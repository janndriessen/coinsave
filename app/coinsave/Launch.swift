//
//  Launch.swift
//  coinsave
//
//  Created by Jann Driessen on 04.02.25.
//

import SwiftUI

struct Launch: View {
    @Binding var shouldTransition: Bool
    @State private var isLoading = false

    var body: some View {
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
                    Task {
                        isLoading = true
                        try? await Task.sleep(nanoseconds: 2_500_000_000)
                        withAnimation(.easeIn) {
                            isLoading = false
                            shouldTransition = true
                        }
                    }
                }) {
                    ZStack {
                        if isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        } else {
                            Text("Create")
                                .fontWeight(.bold)
                        }
                    }
                    .padding()
                    .frame(width: 150, height: 60)
                    .background(CSColor.blue)
                    .foregroundColor(.white)
                    .cornerRadius(30)
                    .shadow(color: .gray.opacity(0.5), radius: 10, x: 5, y: 5)
                }
                .buttonStyle(PlainButtonStyle())
                .disabled(isLoading)
            }
            .padding()
        }
    }
}
