def solution(M, R, D):
    # If required items to sell (R) is greater than total possible sales in D days
    # then it's impossible. Maximum sales per day is 1, so max sales in D days is D
    if R > D:
        return "NO"
    
    # Calculate maximum possible items we can sell
    # Each day we can either:
    # 1. Sell an item if we have stock
    # 2. Buy an item if we're below capacity
    
    # Maximum items we can sell = min(D, initial_stock + possible_restocks)
    max_possible_sales = min(D, M + D - R)
    
    # If required sales is greater than maximum possible sales, return NO
    if R > max_possible_sales:
        return "NO"
        
    return "YES"

# Read input
M = int(input())
R = int(input())
D = int(input())

# Get and print result
out = solution(M, R, D)
print(out) 