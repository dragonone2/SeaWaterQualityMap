import pandas as pd

# Load the CSV data
df = pd.read_csv("Ocean_Quality4.csv")

# Transpose the data for easier handling
df = df.T

# Identify the rows of interest
keys = ["수소이온농도pH","용존산소량DO (㎎/ℓ)","총질소TN (㎍/ℓ)","총인TP (㎍/ℓ)"]

# Loop over the keys and years
for key in keys:
    for year in range(2018, 2023):
        # Get the row index for the year
        year_row_idx = df[df.iloc[:,0] == str(year)].index[0]
        # Get the row index for the key
        key_row_idx = df[df.iloc[:,0] == key].index[0]
        # Get the index for "속초연안"
        target_idx = df[df.iloc[:,1] == "속초연안"].index[0]
        if key_row_idx > year_row_idx and key_row_idx < target_idx:
            # Print the year, key, and value
            print(f"{year} {key} : {df.iloc[target_idx,key_row_idx]}")
